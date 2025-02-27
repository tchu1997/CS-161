import React from 'react'
import ProductCreate from "../../pages/admin/product/ProductCreate";
import { Select } from 'antd';
const { Option } = Select;


const ProductCreateForm = ({
                               handleSubmit,
                               handleChange,
                               setValues,
                               values,
                               handleCategoryChange,
                               subOptions,
                               showSub
}) =>{
    // destructure
    const {title,
        description,
        price,
        categories,
        category,
        subs,
        shipping,
        quantity,
        images,
        seasons,
        brands,
        season,
        brand} = values;
    return (

    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>
                Title
            </label>
            <input
                type="text"
                name="title"
                className="form-control"
                value={title}
                onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>
                Description
            </label>
            <input
                type="text"
                name="description"
                className="form-control"
                value={description}
                onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>
                Price
            </label>
            <input
                type="number"
                name="price"
                className="form-control"
                value={price}
                onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>
                Shipping
            </label>
            <select name="shipping" className="form-control" onChange={handleChange}>
                <option value="No">Please select</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>

            </select>
        </div>

        <div className="form-group">
            <label>
                Quantity
            </label>
            <input
                type="number"
                name="quantity"
                className="form-control"
                value={quantity}
                onChange={handleChange}
            />
        </div>

        <div className="form-group">
            <label>
                Season
            </label>
            <select
                name="season"
                className="form-control"
                onChange={handleChange}
            >
                <option> Please select </option>
                {seasons.map((season) =>
                    (<option key={season} value={season}>
                        {season}
                    </option>
                    ))}

            </select>
        </div>

        <div className="form-group">
            <label>
                Brand
            </label>
            <select name="brand" className="form-control" onChange={handleChange}>
                <option value="No">Please select</option>
                {brands.map(brand =>
                    <option key={brand} value={brand}>
                        { brand }
                    </option>)}

            </select>
        </div>

        <div className="form-group">
            <label>Category</label>
            <select
                name="category"
                className="form-control"
                onChange={handleCategoryChange}
            >
                <option>Please Select</option>
                {categories.length > 0 &&
                categories.map((category) => (<option key={category._id} value={category._id}>
                    {category.name}
                </option>))}
            </select>
        </div>

        {/*{subOptions ? subOptions.length : 'no subs yet'}*/}

        {/*{categories.length}*/}

        {showSub && (
            <div>
            <label>Sub Categories</label>
            <Select
                mode = "multiple"
                style={{width: '100%'}}
                placeholder= "Please Select"
                value={subs}
                onChange={(value) => setValues({...values, subs: value})}
            >

                {subOptions.length &&
                subOptions.map((s) => (
                    <Option key={s._id} value={s._id}>
                        {s.name}
                    </Option>
                ))}
            </Select>
        </div>
        )}
        <br/>

        <button className="btn btn-outline-info">
            Save
        </button>

    </form>
);
};

export default ProductCreateForm;