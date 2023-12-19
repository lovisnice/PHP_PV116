import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Button, Popconfirm, Table} from "antd";
import {ColumnsType} from "antd/es/table";

interface ICategoryItem {
    id: number;
    name: string;
    image: string;
}

const HomePage = () => {
    const[list, setList] = useState<ICategoryItem[]>([]);
    const navigate = useNavigate();

    const handleEdit = (categoryId: string) => {
        navigate(`/categories/edit/${categoryId}`);
    };
    const handleDelete = async (categoryId: string) => {
        try {
            // Assuming you have an API endpoint for category deletion
            await axios.delete(`http://127.0.0.1:8000/api/categories/${categoryId}`);
            location.reload();
            // Add logic to update your data source or refresh the table
            console.log('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            // Handle error and provide user feedback
        }
    };

    useEffect(() => {
        axios.get<ICategoryItem[]>("http://127.0.0.1:8000/api/categories")
            .then(resp=> {
                //console.log("Resp data", resp.data);
                setList(resp.data);
            });
    },[]);

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: '#',
            dataIndex: 'id'
        },
        {
            title: 'Photo',
            dataIndex: 'image',
            render: (image: string) => {
                return (
                    <img src={`http://127.0.0.1:8000/upload/50_${image}`} width={100} alt={"Фото"}/>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Edit',
            dataIndex: 'id', // Assuming 'id' is the unique identifier for your category
            render: (categoryId: string) => (
                <Button type="primary" size="small" onClick={() => handleEdit(categoryId)}>
                    Edit
                </Button>
            ),
        },
        {
            title: 'Delete',
            dataIndex: 'id', // Assuming 'id' is the unique identifier for your category
            render: (categoryId: string) => (
                <Popconfirm
                    title="Are you sure you want to delete this category?"
                    onConfirm={() => handleDelete(categoryId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" size="small">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <h1>Привіт Козаки!</h1>
            <Link to={"/categories/create"}>Add category</Link>
            <Table dataSource={list} rowKey="id" columns={columns} />
        </>
    )
}

export default HomePage;