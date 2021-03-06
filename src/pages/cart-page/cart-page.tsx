import React, {FC, useEffect, useState} from "react";
import {TProduct} from "../../types";
import styles from "./cart-page.module.css";
import {CartItem} from "../../components/cart-item/cart-item";
import {usePagination} from "../../hooks/usePagination";
import {Pagination} from "../../components/pagination/pagination";
import {GoBackIcon} from "../../components/icons/go-back-icon/go-back-icon";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {createOrder} from "../../store/order";
import {clearCart, updateInStock} from "../../store/goods";
import {useHistory} from "react-router-dom";
import {TCart, TOrder} from "../../store/types/order";
import {nanoid} from "nanoid";
import {toast} from "react-toastify";

export const CartPage: FC = (): JSX.Element => {
    const history = useHistory()
    const dispatch = useDispatch()
    const {data, cart} = useSelector((state: RootState) => state.data)
    const {hasError} = useSelector((state: RootState) => state.order)
    const {data: userData} = useSelector((state: RootState) => state.user)
    const {_id} = userData
    const [productsInCart, setProductsInCart] = useState<Array<TProduct>>([])

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        setPage,
        totalPages,
    } = usePagination({
        contentPerPage: 2,
        count: productsInCart.length,
    })

    const getTotalPrice = () => {
        const price = productsInCart.reduce((acc, item) => item.count ? (Number(item.price) * Number(item.count)) + acc : Number(item.price) + acc, 0)
        return price.toLocaleString()
    }

    function getNewInStock(data: Array<TProduct>, cart: Array<TCart>, dispatch: any, action: any) {
        data.forEach(item => {
            cart.forEach(c => {
                if (item.id === c.id) {
                    const payload = item.inStock - c.count
                    dispatch(action(item.id, payload))
                }
            })
        })
    }

    const handleSubmit = async () => {

        const orderId = nanoid()
        const payload: TOrder = {
            orderId: orderId,
            userId: _id,
            created_at: Date.now(),
            completed: false,
            order: cart
        }
        await dispatch(createOrder(orderId, payload))
        toast.success(`?????????? ??? ...${orderId.slice(-4)} ??????????????????`)
        getNewInStock(data, cart, dispatch, updateInStock)

        if (!hasError) {
            await dispatch(clearCart())
            history.push("/")
        }
    }

    useEffect(() => {
        setProductsInCart([])
        for (let itemData of data) {
            for (let itemCart of cart) {
                if (itemData.id === itemCart.id) {
                    setProductsInCart(prevState => [
                        ...prevState,
                        {
                            ...itemData,
                            count: itemCart.count
                        }
                    ])
                }
            }
        }
    }, [cart, data])

    return (
        <>
            {productsInCart.length
                ? (<div className={styles.cartPage_wrapper}>
                    <span className={styles.cartPage__goBack_icon}><GoBackIcon/></span>
                    <ul className={styles.cartPage_container}>
                        {productsInCart.slice(firstContentIndex, lastContentIndex).map((item, index) => <CartItem
                            key={index} {...item}/>)}
                    </ul>
                    <div className={styles.cartPage_pagination}>
                        <Pagination page={page} totalPages={totalPages ? totalPages : 0}
                                    firstContentIndex={firstContentIndex}
                                    lastContentIndex={lastContentIndex} nextPage={nextPage} prevPage={prevPage}
                                    setPage={setPage}/>
                    </div>
                    <div className={`sidebar_container ${styles.sidebar_position} ${styles.sidebar_wrapper}`}>
                        <div>??????????: {productsInCart.length} ????????????(????)</div>
                        <div>???????????????? ??????????: {getTotalPrice()}</div>
                        <button
                            className="btn"
                            onClick={handleSubmit}
                        >
                            ???????????????? ??????????
                        </button>
                    </div>
                </div>)
                : <h2 className={styles.cartPage_cartEmpty}>?????????????? ?????????? <i className="bi bi-emoji-smile"/></h2>
            }
        </>
    )
}