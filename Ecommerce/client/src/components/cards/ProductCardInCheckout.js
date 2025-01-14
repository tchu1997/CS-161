import React from 'react';
import ModalImage from 'react-modal-image'
import Default from '../../images/Default.jpg';
import {useDispatch} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import {CheckCircleOutlined, CloseCircleOutlined, CloseOutlined} from "@ant-design/icons";




const ProductCardInCheckout = ({p}) => {
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'Whole Year'];
    let dispatch = useDispatch();
    const handleSeasonChange = e => {
        console.log('Season changed', e.target.value);

        let cart = []
        if(typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) => {
                if(product._id === p._id){
                    cart[i].season = e.target.value;
                }
            });

            //console.log('card update season', cart)
            localStorage.setItem("cart", JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            })
        }
    };

    const handleQuantityChange = e => {
        //console.log('available quantity', p.quantity);

        let count = e.target.value < 1 ? 1 : e.target.value;
        if(count > p.quantity){
            toast.error(`Max available quantity: ${p.quantity}`);
            return;
        }

        let cart = []
        if(typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if(product._id === p._id){
                    cart[i].count = count;
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            })
        }
    }

    const handleRemove = () => {
        //console.log(p._id, "to Remove")
        let cart = []
        if(typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            // [1,2,3,4,5]
            cart.map((product, i) => {
                if(product._id === p._id){
                    cart.splice(i, 1);
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            })
        }
    }
    return(
        <tbody>
            <tr>
                <td>
                    <div style={{width: "100px", height: "auto"}}>
                        {p.images.length ? (
                            <ModalImage
                                small={p.images[0].url}
                                large={p.images[0].url}
                            />
                            ) : (
                            <ModalImage
                                small={Default}
                                large={Default}
                            />
                        )}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>$ {p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select
                        onChange={handleSeasonChange}
                        name="season"
                        className="form-control"
                        id="">
                        {p.season ? <option value={p.season}>
                            {p.season}
                        </option> : <option>
                            Select
                        </option>}
                        {seasons.filter((s) => s !== p.season).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </td>
                <td className="text-center">
                    <input
                        type="number"
                        className="form-control"
                        value={p.count}
                        onChange={handleQuantityChange}
                    />
                </td>
                <td className="text-center">{
                    p.shipping === "Yes" ?
                        <CheckCircleOutlined
                            className="text-success text-center"/> :
                        <CloseCircleOutlined
                            className="text-danger text-center"
                        />
                }</td>
                <td className="text-center"><CloseOutlined
                    onClick={handleRemove}
                    className="text-danger pointer"
                /></td>
            </tr>
        </tbody>
    )
}

export default ProductCardInCheckout