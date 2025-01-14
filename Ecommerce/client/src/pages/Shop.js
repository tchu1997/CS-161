import React, {useState, useEffect} from 'react'
import {getProductsByCount, fetchProductsByFilter} from "../functions/product";
import {useSelector, useDispatch} from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import {Menu, Slider, Checkbox} from 'antd'
import {DollarOutlined, DownSquareOutlined, StarOutlined} from "@ant-design/icons";
import {getCategories} from "../functions/category";
import {getSubs} from "../functions/sub";
import Star from "../components/forms/Star";
import Radio from "antd/es/radio";
import {load} from "dotenv";

const {SubMenu, ItemGroup} = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState('')
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [brands, setBrands] = useState([
        'Hiking', 'Visiting', 'Traveling', 'Entertaining', 'Relaxing'
    ]);

    const [brand, setBrand] = useState('');

    const [seasons, setSeasons] = useState([
        'Spring', 'Summer', 'Fall', 'Winter', 'Whole Year'
    ])

    const [shipping, setShipping] = useState('');

    const [season, setSeason] = useState('');

    let dispatch = useDispatch();

    let {search} = useSelector((state) => ({ ...state }));

    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        //fetch Categories
        getCategories().then((res) => setCategories(res.data));
        //fetch subcategories
        getSubs().then(res => setSubs(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then((res) => {
            setProducts(res.data);
        });
    };




    // 1. load Products on page load by default
    const loadAllProducts = () => {
        getProductsByCount(12).then((p) => {
            setProducts(p.data)
            setLoading(false);
        });
    };

    //2. load products on user search input
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({query: text});
            if(!text){
                loadAllProducts();
            }
        }, 300);
        return () => clearTimeout(delayed)


    }, [text]);



    // 3. load products based on price range
    useEffect(() => {
        //console.log('ok to request')
        fetchProducts({ price });
    }, [ok]);

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        // reset
        setCategoryIds([]);
        setPrice(value);
        setStar("");
        setSub('')
        setBrand('');
        setSeason('');
        setShipping('');
        setTimeout(() => {
            setOk(!ok)
        }, 300);
    };

    // 4. load products based on category
    // show categories in a list of checkbox
    const showCategories = () => categories.map((c) =>
        <div key={c._id}>
            <Checkbox
                onChange={handleCheck}
                className="pt-2 pb-2 pl-4 pr-4"
                value={c._id}
                name="category"
                checked={categoryIds.includes(c._id)}
            >
                {c.name}
            </Checkbox>
            <br/>
        </div>
    );

    // handle check for categories
    const handleCheck = e => {
        //reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0,0]);
        setStar("");
        setSub('')
        setBrand('');
        setSeason('');
        setShipping('');
        //console.log(e.target.value);
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked); // index or -1

        // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
        if(foundInTheState === -1){
            inTheState.push(justChecked);
        }
        else {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        //console.log(inTheState);
        fetchProducts({category: inTheState});


    };

    // 5. show Products by Star Rating
    const handleStarClick = (num) => {
        //console.log(num);
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setStar(num);
        setSub('')
        setBrand('');
        setSeason('');
        setShipping('');
        fetchProducts({stars: num});
    }
    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star
                starClick = {handleStarClick}
            numberOfStars={5}
            />
            <Star
                starClick = {handleStarClick}
                numberOfStars={4}
            />
            <Star
                starClick = {handleStarClick}
                numberOfStars={3}
            />
            <Star
                starClick = {handleStarClick}
                numberOfStars={2}
            />
            <Star
                starClick = {handleStarClick}
                numberOfStars={1}
            />
        </div>
    )

    // 6. show products by sub category
    const showSubs = () => subs.map((s) =>
        <div
            key={s._id}
            className="pt-1 p-1 m-1 badge badge-secondary"
            onClick={() => handleSub(s)}
            style={{ cursor: "pointer"}}
        >
            {s.name}
        </div>
    );

    const handleSub = (sub) => {
        //console.log("SUB", s);
        setSub(sub)
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setSeason('');
        setShipping('');
        fetchProducts({sub});


    };



    // 7. show products based on brand name
    const showBrands = () =>
        brands.map((b) => (
            <Radio
                key= {b}
                value={b}
                name={b}
                checked={b === brand}
                onChange={handleBrand}
                className="pt-2 pb-1 pl-4 pr-4"
            >
                {b}
            </Radio>
                ));

    const handleBrand = (e) => {
        setSub('')
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setSeason('')
        setBrand(e.target.value)
        setShipping('');
        fetchProducts({ brand: e.target.value});
    }

    // 8. Show Seasons based on season
    const showSeasons = () =>
        seasons.map((s) => (
            <Radio
                key={s}
                value={s}
                name={s}
                checked={s === season}
                onChange={handleSeason}
                className="pt-2 pb-1 pl-4 pr-4">
                {s}
            </Radio>
        ));

    const handleSeason = (e) => {
        setSub('')
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setSeason(e.target.value);
        setShipping('');
        fetchProducts({ season: e.target.value});
    };

    // 9. show products based on shipping yes/no
    const showShipping = () => (
        <>
            <Checkbox
                className="pt-2 pb-2 pl-4 pr-4"
                onChange={handleShippingChange}
                value="Yes"
                checked={shipping === "Yes"}
            >
                Yes
            </Checkbox>

            <Checkbox
                className="pt-1 pb-2 pl-3 pr-4"
                onChange={handleShippingChange}
                value="No"
                checked={shipping === "No"}
            >
                No
            </Checkbox>
        </>
    )

    const handleShippingChange = (e) => {
        setSub('')
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setSeason('');
        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value});
    }



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr/>
                    <Menu defaultOpenKeys={['1', '2', '3' , '4', '5', '6', '7']} mode="inline">
                        {/* PRICE*/}
                        <SubMenu key="1" title={
                            <span className="h6">
                            <DollarOutlined/> Price
                        </span>
                        }
                        >
                            <div>
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(v) => `$${v}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="4999"
                                />
                            </div>
                        </SubMenu>


                        {/*CATEGORY*/}
                        <SubMenu
                            key="2"
                            title={
                                <span className="h6 text-warning">
                                    <DownSquareOutlined/> Categories
                                </span>
                            }
                        >
                            <div style={{ marginTop: "-10px"}}>
                                {showCategories()}
                            </div>
                        </SubMenu>

                        {/* STARS */}
                        <SubMenu
                            key="3"
                            title={
                                <span className="h6 text-warning">
                                    <StarOutlined /> Rating
                                </span>
                            }
                        >
                            <div style={{ marginTop: "-10px"}}>
                                {showStars()}
                            </div>
                        </SubMenu>

                        {/*SUB CATEGORIES*/}

                        <SubMenu
                            key="4"
                            title={
                                <span className="h6 text-warning">
                                    <DownSquareOutlined/> Sub Categories
                                </span>
                            }
                        >
                            <div style={{ marginTop: "-10px"}}
                                 className="pl-4 pr-4"
                            >
                                {showSubs()}
                            </div>
                        </SubMenu>

                        {/*BRANDS*/}

                        <SubMenu
                            key="5"
                            title={
                                <span className="h6 text-warning">
                                    <DownSquareOutlined/> Brands
                                </span>
                            }
                        >
                            <div style={{ marginTop: "-10px"}}
                                 className="pr-5"
                            >
                                {showBrands()}
                            </div>
                        </SubMenu>


                        {/* Seasons */}
                        <SubMenu
                            key="6"
                            title={
                                <span className="h6 text-warning">
                                    <DownSquareOutlined/> Seasons
                                </span>
                            }
                        >
                            <div style={{ marginTop: "-10px"}}
                                 className="pr-5"
                            >
                                {showSeasons()}
                            </div>
                        </SubMenu>

                        {/* Shipping */}
                        <SubMenu
                            key="7"
                            title={
                                <span className="h6 text-warning">
                                    <DownSquareOutlined /> Shipping
                                </span>
                            }
                        >
                            <div style={{ marginTop: "-10px"}}
                                 className="pr-5"
                            >
                                {showShipping()}
                            </div>
                        </SubMenu>


                    </Menu>
                </div>
                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">
                            Loading...
                        </h4>
                    ) : (
                        <h4 className="text-danger">
                            Products
                        </h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className="row pb-5">
                        {products.map((p) => (
                            <div key={p._id} className="col-md-4 mt-3">
                                <ProductCard product={p}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Shop