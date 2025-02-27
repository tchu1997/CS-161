import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterVendor = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mailAddr, setMail] = useState('');
    const [workAddr, setWork] = useState('');
    const [checkboxBool, setCheck] = useState('');
    //const {user} = useSelector(state => ({...state}));

    let dispatch = useDispatch();

    useEffect(() => {
        setEmail(window.localStorage.getItem("emailForRegistration"));
        /*console.log(window.location.href);
        console.log(window.localStorage.getItem("emailForRegistration"));*/
    }, [history]);
    //props.history

    const handleSubmit = async (e) => {
        e.preventDefault();
        //validation
        if (!name || !workAddr) {
            toast.error('Full name and business address are required')
            return;
        }
        if (!email || !password) {
            toast.error('Email and password is required')
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return;
        }

        if (checkboxBool) {
            setMail(workAddr);
        }
        else if (!mailAddr) {
            toast.error('Mailing address is required')
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            //console.log("RESULT", result);
            if (result.user.emailVerified) {
                //remove user email from local storage
                window.localStorage.removeItem("emailForRegistration");

                // get user id token
                let user = auth.currentUser
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult()
                // redux store
                console.log('user', user, 'idTokenResult', idTokenResult);

                createOrUpdateUser({name, workAddr, mailAddr, role:"admin"}, idTokenResult.token).then(
                    (res) => {
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                businessAddress: res.data.businessAddress,
                                mailingAddress: res.data.mailingAddress,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                    }
                ).catch(err => console.log(err));
                // redirect
                history.push('/')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const completeRegistrationForm = () =>
        <form onSubmit={handleSubmit}>
            <input type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                autoFocus
            />

            <input type="text"
                className="form-control"
                value={workAddr}
                onChange={e => setWork(e.target.value)}
                placeholder="Business address"
            />

            <input type="checkbox"
                name="same"
                value={checkboxBool}
                onClick={e => setCheck(e.target.checked)}
                unchecked />
                Mailing address is same as business address

            <input type="text"
                className="form-control"
                value={mailAddr}
                onChange={e => setMail(e.target.value)}
                placeholder="Mailing address"
                disabled={checkboxBool}
            />

            <input type="email"
                className="form-control"
                value={email}
                disabled
                //autofocus
            />

            <input type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />
            <br />

            <button type="submit" className="btn btn-raised">
                Complete Registration
            </button>
        </form>

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register Complete</h4>

                    {completeRegistrationForm()}
                </div>
            </div>
        </div>
    );
};

export default RegisterVendor;