import React, { useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getUserCart, emptyUserCart, saveUserAddress, applyCoupon} from '../functions/user'
import {toast} from "react-toastify";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';



const Checkout = ({history}) => {

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('');
    // discount price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError,  setDiscountError] = useState('');

    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        getUserCart(user.token)
            .then((res) => {
                console.log('user cart res', JSON.stringify(res.data, null, 4));
                setProducts(res.data.products);
                setTotal(res.data.cartTotal);
            });
    }, []);

    const emptyCart = () => {
        //remove from local storage
        if(typeof  window !== "undefined"){
            localStorage.removeItem("cart");
        }
        // remove from redux
        dispatch({
            type: 'ADD_TO_CART',
            payload: [],
        });

        //remove from backend
        emptyUserCart(user.token)
            .then(res => {
                setProducts([]);
                setTotal(0);
                setTotalAfterDiscount(0)
                setCoupon('');
                toast.success('Cart is empty. Continue shopping.');
            })
    };

    const saveAddressToDb = () => {
        //console.log(address);
        saveUserAddress(user.token, address).then((res) => {
            if(res.data.ok){
                setAddressSaved(true)
                toast.success('Address saved');
            }
        })
    };

    const applyDiscountCoupon = () => {
        console.log('send coupon to backend', coupon);
        applyCoupon(user.token, coupon)
            .then(res => {
                console.log('RES ON COUPON APPLIED', res.data)
                if(res.data){
                    setTotalAfterDiscount(res.data);
                    // push the totalAfterDiscount to redux true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: true,
                    });

                }
                // error
                if(res.data.err){
                    setDiscountError(res.data.err);
                    // update redux coupon applied true/false
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false,
                    });
                }
            })

    }

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
                Save
            </button>
        </>
    );



    const showProductSummary = () =>
        products.map( (p,i) => (
                <div key={i}>
                    <p>
                        {p.product.title} ({p.season}) x {p.count} ={" "}
                        {p.product.price * p.count}
                    </p>
                </div>
            ));

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value)
                    setDiscountError("");
                }}
                value={coupon}
                type="text"
                className="form-control"
            />
            <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
                Apply
            </button>
        </>
    )


    return(
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br/>
                <br/>
                {showAddress()}

                <hr/>
                <h4>Got Coupon?</h4>
                <br/>
                <br/>
                {showApplyCoupon()}
                <br/>
                {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>

            <div className="col-md-6">
                <h4>Order Summary</h4>


                {/*<h1>{total}</h1>*/}
                {/*{JSON.stringify(products)}*/}
                <hr/>
                <p>Products {products.length}</p>
                <hr/>
                {showProductSummary()}
                <hr/>
                <p>
                    <h6>Cart Total: {total}</h6>
                </p>

                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">Discount Applied: Total Payable : ${totalAfterDiscount}
                    </p>
                )}

                <div className="row">
                    <div className="col-md-6">
                        <button
                            className="btn btn-primary"
                            disabled={!addressSaved || !products.length}
                            onClick={() => history.push('/payment')}
                        >
                            Place Order
                        </button>
                    </div>

                    <div className="col-md-6">
                        <button
                            disabled={!products.length}
                            onClick={emptyCart}
                            className="btn btn-primary">Empty Cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout