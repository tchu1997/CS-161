import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {getSubs} from "../../functions/sub";

const SubList = () => {
    const [state, setState] = useState({});
    const [subs, setSubs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getSubs().then(res => {
            setSubs(res.data);
            setLoading(false);
        });
        return () => {
            setState({});
        };
    }, []);

    const showSubs = () => subs.map((s) => (<div
        key = {s._id}
        className="col btn btn-outline-primary btn-lg btn-block btn-raised m-3">
        <Link to={`/sub/${s.slug}`}>{s.name}</Link>

    </div>));

    return (
        <div className="container">
            <div className="row">
                {loading ? (<h4 className="text-center">Loading...</h4>) : showSubs()}
            </div>
        </div>
    )
};

export default SubList;
