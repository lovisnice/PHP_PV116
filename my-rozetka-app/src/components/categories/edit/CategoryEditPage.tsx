import {useNavigate, useParams} from "react-router-dom";
import {Alert, Button, Divider, Form, Input, message, Upload} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {ICategoryCreate} from "../type.ts";
import type {RcFile, UploadFile, UploadProps} from "antd/es/upload/interface";
import type {UploadChangeParam} from "antd/es/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

interface ICategoryItem {
    id: number;
    name: string;
    image: string;
}

// ... (imports)

// ... (imports)

const CategoryEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [form] = Form.useForm(); // Create form instance

    useEffect(() => {
        axios.get<ICategoryItem>(`http://127.0.0.1:8000/api/categories/edit/${id}`)
            .then(resp => {
                form.setFieldsValue(resp.data);
                setImageURL(`http://127.0.0.1:8000/upload/50_${resp.data.image}`);
                console.log(resp.data);
            });
    }, [id, form]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', file);
        if (file == null) {
            setErrorMessage("Оберіть фото!");
            return;
        }

        const model: ICategoryCreate = {
            name: values.name,
            image: file,
        };

        try {
            await axios.post<ICategoryItem>(`http://127.0.0.1:8000/api/categories/edit/${id}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (ex) {
            message.error('Помилка створення категорії!');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const [loading, setLoading] = useState(false);
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setLoading(false);
            setFile(file);
            setErrorMessage("");
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        return isImage && isLt2M;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    type FieldType = {
        name?: string;
    };

    return (
        <>
            <Divider style={customDividerStyle}>Edit category</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                name="basic"
                style={{ maxWidth: 1000 }}
                form={form}
                initialValues={{ remember: true }} // Set initial values directly here
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Назва"
                    name="name"
                    rules={[{ required: true, message: 'Вкажіть назву категорії!' }]}
                >
                    <Input />
                </Form.Item>

                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    accept={"image/*"}
                >
                    {file ? (
                        <img src={URL.createObjectURL(file)} alt="avatar" style={{ width: '100%' }} />
                    ) : imageURL ? (
                        <img src={imageURL} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                        uploadButton
                    )}
                </Upload>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Додати
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CategoryEditPage;

