import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Filebase from 'react-file-base64';
import dataAdditional from '../../../constants/local-db.json';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import './style.scss'
import { createProduct, fetchProductData } from '../../../slices/product-slice';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { uiLoading } from '../../../App';

Modal.setAppElement('#root');

function CreateProduct(props) {

    const dispatch = useDispatch();
    const params = useParams();

    useEffect(() => {
        document.title = 'Create Product';
    }, [])

    const history = useHistory();

    const [newData, setNewData] = useState({
        name: '',
        price: 0,
        sale: '',
        thumbnail: 'https://dummyimage.com/250/313131/cccccc',
        stock: 0,
        images: [],
        category: '',
        brand: '',
        description: '',
        descriptionDetail: '',
        isEnable: true,
    });
    const [modalDesc, setModalDesc] = useState(false);
    const [desc, setDesc] = useState({
        id: '',
        type: '',
        content: ''
    });

    const customStyles = {
        content: {
            height: '400px',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    useEffect(async () => {
        if (params.id) {
            console.log("get data...")
            const actionResult = await dispatch(fetchProductData());
            console.log(actionResult);
            const data = unwrapResult(actionResult);
            const target = data.find(item => item._id === params.id);
            target && setNewData(target);
        } else {

        }
    }, [dispatch]);

    const categoryList = dataAdditional.categories;
    const brandList = dataAdditional.brands;
    const specList = dataAdditional.specs;

    const convertToOptions = (arr) => {
        const options = [];
        for (let index = 0; index < arr.length; index++) {
            options.push({ value: arr[index].name, label: arr[index].name })
        }
        return options;
    }

    const handleAddDescription = () => {
        if (newData.description !== '') {
            let addDesc = JSON.parse(newData.description);
            addDesc.push(desc);
            setNewData({ ...newData, description: JSON.stringify(addDesc) });
            setDesc({
                id: '',
                type: '',
                content: ''
            });
            setModalDesc(false);
        } else {
            let addDesc = [];
            addDesc.push(desc);
            setNewData({ ...newData, description: JSON.stringify(addDesc) });
            setDesc({
                id: '',
                type: '',
                content: ''
            });
            setModalDesc(false);
        }
    }

    const handleRemoveDesc = (id) => {
        if (newData.description !== '') {
            let descList = JSON.parse(newData.description);
            let descFiltered = descList.filter(item => item.id !== id);
            setNewData({ ...newData, description: JSON.stringify(descFiltered) });
        }
    }

    const displayDescriptions = () => {
        if (newData.description !== '') {
            const descList = JSON.parse(newData.description);
            return (
                <table class="table table-bordered">
                    <tbody>
                        {
                            descList && descList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.type}</td>
                                        <td>
                                            <div className="d-flex justify-content-between">
                                                {item.content}
                                                <a className="btn btn-danger btn-sm" onClick={() => handleRemoveDesc(item.id)}><i className="fas fa-backspace"></i></a>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )
        } else {
            return;
        }
    }

    const displayProductImages = () => {
        if (newData !== []) {
            return (
                newData.images && newData.images.map((item, index) => {
                    return (
                        <div className="card bg-light text-white" style={{ width: '15rem' }} key={index}>
                            <img className="card-img" src={item} alt="Card image" />
                            <div className="card-img-overlay">
                                <a className="card-title btn btn-danger" onClick={(image) => handleRemoveImage(item)}><i class="fas fa-times"></i></a>
                            </div>
                        </div>
                    )
                })
            )
        } else {
            return;
        }
    }

    const handleAddImage = (data) => {
        let imageList = newData.images;
        for (const image of data) {
            imageList.push(image.base64);
        }
        setNewData({ ...newData, images: imageList });
    }

    const handleRemoveImage = (image) => {
        let imageList = newData.images;
        let filter = imageList.filter(item => item !== image);
        setNewData({ ...newData, images: filter });
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();
        dispatch(createProduct(newData));
        productAdded();
    }

    const productAdded = () => {
        return toast.success(
            <div>
                <CheckCircleOutlineIcon /> Ok
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1>{params.id ? "Update product" : "Create Product"}</h1>
            <form>
                <div className="form-row">
                    <div className="form-group col">
                        <label htmlFor="name">Product name</label>
                        <input type="text" className="form-control" value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} id="name" />
                    </div>
                    {
                        params.id && (
                            <div className="form-group col-2">
                                <label className="d-block">Is Enable</label>
                                <FormControl component="fieldset">
                                    <FormGroup aria-label="position" row>
                                        <FormControlLabel
                                            control={<Switch color="secondary" />}
                                            checked={newData.isEnable}
                                            onChange={() => setNewData({ ...newData, isEnable: !newData.isEnable })}
                                        />
                                    </FormGroup>
                                </FormControl>
                            </div>
                        )
                    }
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="category">Category</label>
                        <Select id="category" defaultValue={{ label: newData.category, value: newData.category }} onChange={(e) => setNewData({ ...newData, category: e.value })} options={convertToOptions(categoryList)} />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="brand">Brand</label>
                        <Select id="brand" defaultValue={{ label: newData.brand, value: newData.brand }} onChange={(e) => setNewData({ ...newData, brand: e.value })} options={convertToOptions(brandList)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="price">Price</label>
                        <input type="number" value={newData.price} min={0} className="form-control" onChange={(e) => setNewData({ ...newData, price: e.target.value })} id="price" />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="discount">Discount</label>
                        <input type="number" value={newData.sale} min={0} max={100} className="form-control" onChange={(e) => setNewData({ ...newData, sale: e.target.value })} id="discount" />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="stock">Stock</label>
                        <input type="number" value={newData.stock} min={0} className="form-control" onChange={(e) => setNewData({ ...newData, stock: e.target.value })} id="stock" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-6">
                        <div className="form-group form-shadow p-4">
                            <label className="d-block">Thumbnail</label>
                            <Filebase
                                type="file"
                                multiple={false}
                                className="form-control"
                                onDone={(data) => setNewData({ ...newData, thumbnail: data.base64 })}
                            />
                            <img src={newData.thumbnail} alt="..." class="img-thumbnail mt-3"></img>
                        </div>
                        <div className="form-group form-shadow p-4">
                            <div className="mb-5">
                                <label className="d-block">Add image</label>
                                <Filebase
                                    type="file"
                                    multiple={true}
                                    onDone={(data) => handleAddImage(data)}
                                />
                            </div>
                            {displayProductImages()}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="border form-shadow p-4">
                            <h3 className="d-block text-center">Specs</h3>
                            <div className="form-row">
                                {displayDescriptions()}
                            </div>
                            <div className="d-flex justify-content-end">
                                <a className="btn btn-primary" onClick={() => setModalDesc(true)}><i class="fas fa-plus"></i></a>
                            </div>
                            <div>
                                <Modal
                                    isOpen={modalDesc}
                                    style={customStyles}
                                    ariaHideApp={false}
                                >
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <Select id="category" onChange={(e) => setDesc({ ...desc, type: e.value, id: uuidv4() })} options={convertToOptions(specList)} />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <textarea rows="4" cols="40" height="200px" style={{ height: '300px' }} type="text" onChange={(e) => setDesc({ ...desc, content: e.target.value })} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <a className="btn btn-danger" onClick={() => setModalDesc(false)}>Close</a>
                                        <a className="btn btn-primary" onClick={handleAddDescription}>Add</a>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="descriptionDetail">Description Detail</label>
                            <textarea row="10" type="text" className="form-control" value={newData.descriptionDetail} onChange={(e) => setNewData({ ...newData, descriptionDetail: e.target.value })} id="descriptionDetail" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <a onClick={() => history.push('/admin')} class="btn btn-outline-secondary btn-lg btn-block mt-4 mb-5">Back</a>
                    </div>
                    <div className="col-8">
                        <button onClick={handleAddProduct} class="btn btn-secondary btn-lg btn-block mt-4 mb-5">{params.id ? "Update product" : "Create Product"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateProduct;