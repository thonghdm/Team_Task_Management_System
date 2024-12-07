import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Card,
} from "@mui/material";
import Header from '../Header';
import { toast } from "react-toastify";

import { createNew } from '~/apis/Project/projectService';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { getRandomColor } from '~/utils/radomColor';
import { useDispatch, useSelector } from 'react-redux';
import { createNewList } from '~/apis/Project/listService'
import { createNewTask } from '~/apis/Project/taskService'
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
const ImportProject = () => {
    const dispatch = useDispatch();


    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const fileInputRef = useRef(null);


    const [failedUsers, setFailedUsers] = useState([]);
    const [successUsers, setSuccessUsers] = useState([]);
    const [nameFile, setNameFile] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setNameFile(file.name)
        console.log(nameFile.slice(0, -5))
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const binaryStr = event.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });

                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const extractedColumns =
                    jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

                setData(jsonData);
                setColumns(extractedColumns);
            };

            reader.readAsBinaryString(file);
        }
    };

    const getUniqueLists = (data) => {
        const uniqueLists = new Set();
        data.forEach((item) => uniqueLists.add(item.list));
        return Array.from(uniqueLists);
    }

    const handleClearData = () => {
        setData([]);
        setColumns([]);
        setFailedUsers([]);
        setSuccessUsers([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const excelDateToJSDate = (serial) => {
        const daysSinceEpoch = serial - 25569; // Số ngày từ 01/01/1970 (Unix Epoch)
        const milliseconds = daysSinceEpoch * 86400 * 1000; // Mỗi ngày có 86400 giây
        return new Date(milliseconds);
    }
    const { accesstoken, userData } = useSelector(state => state.auth)

    const refreshToken = useRefreshToken();

    const insertProject = async () => {
        const projectData = {
            projectName: nameFile.slice(0, -5),
            visibility: 'Public',
            ownerId: userData._id,
            membersId: [userData._id],
            color: getRandomColor(),
        };
        const createProject = async (token) => {
            try {
                const response = await createNew(token, projectData); // Create project and get response
                return response.project.createdProject._id; // Trả về id của project
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshToken();
                    return createProject(newToken); // Retry with new token
                }
                throw error;
            }
        };
        try {
            const response = await createProject(accesstoken);
            return response
        } catch (error) {
            toast.error(error.response?.data.message || 'Error creating project!');
        }
    };

    let listIds = {}; // Dùng để lưu trữ list_id theo tên list

    const createList = async (token, list, index, projectId) => {
        try {
            const listData = {
                list_name: list,
                created_by_id: userData._id,
                project_id: projectId,
            };

            const res = await createNewList(token, listData);
            if (res && res.list) {
                listIds[list] = res.list._id; // Lưu id theo tên list
            }
            await dispatch(createAuditLog_project({
                accesstoken: token,
                data: {
                    project_id: projectId,
                    action: 'Create',
                    entity: 'List',
                    user_id: userData?._id,
                    list_id: res?.list?._id,
                }
            }));
            if (res) {
                successUsers.push(index);
            } else {
                failedUsers.push(index);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                const newToken = await refreshToken();
                return createList(newToken, list, index, projectId);
            }
            failedUsers.push(index);
        }
    };

    const createTask = async (token, taskData, index, projectId) => {
        try {
            const listId = listIds[taskData.list]; // Lấy ID của list từ object listIds

            if (!listId) {
                throw new Error(`List ID for ${taskData.list} not found.`);
            }

            const task = {
                task_name: taskData.task,
                list_id: listId, // Dùng list_id để gán cho task
                start_date: excelDateToJSDate(taskData.start_date),
                end_date: excelDateToJSDate(taskData.end_date),
                created_by_id: userData._id,
                project_id: projectId,
                color: getRandomColor(), // Hàm giả lập tạo màu ngẫu nhiên cho task
                description: taskData.description,
            };
            console.log(task);

            const res = await createNewTask(token, task);

            // Nếu response có chứa task và id, log audit
            if (res) {
                await dispatch(createAuditLog_project({
                    accesstoken: token,
                    data: {
                        project_id: projectId,
                        action: 'Create',
                        entity: 'Task',
                        user_id: userData?._id,
                        task_id: res.task._id, // Sử dụng res.task._id ở đây
                    }
                }));
            }

            if (res) {
                successUsers.push(index); // Nếu tạo task thành công
            } else {
                failedUsers.push(index); // Nếu thất bại
            }
        } catch (error) {
            if (error.response?.status === 401) {
                const newToken = await refreshToken();
                return createTask(newToken, taskData, index, projectId); // Gọi lại hàm khi hết token
            }
            throw error; // Ném lại lỗi
        }
    };



    const handleSubmit = async () => {
        if (data.length === 0) {
            toast.error("No data to submit");
            return;
        }
        try {
            const newIdProject = await insertProject(accesstoken); // Chờ insertProject hoàn thành
            if (!newIdProject) {
                throw new Error('Failed to create project.');
            }
            const uniqueLists = getUniqueLists(data);
            if (uniqueLists.length === 0) {
                toast.error('List name is missing!');
                return;
            }
            await Promise.all(uniqueLists.map((list, index) => createList(accesstoken, list, index, newIdProject)));
            await Promise.all(data.map((taskData, index) => createTask(accesstoken, taskData, index, newIdProject)));

            if (successUsers.length > 0) {
                const uniqueUsers = [...new Set(successUsers.map(c => c))];
                toast.success(`${uniqueUsers.length} users added successfully`);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setData([]);
            setColumns([]);

        } catch (error) {
            toast.error("Failed to process user registrations");
        }
    };

    return (
        <>
            <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                <Header />
            </Box>
            <Card sx={{ margin: 3, mt: "90px" }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Excel File Uploader
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Button variant="contained" component="label" color="primary">
                            Upload Excel File
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                            />
                        </Button>

                        {data.length > 0 && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleClearData}
                            >
                                Clear Data
                            </Button>
                        )}
                    </Box>

                    {data.length > 0 && (
                        <>
                            <TableContainer component={Paper} elevation={3}>
                                <Table sx={{ minWidth: 650 }} aria-label="excel data table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell key={column} sx={{ fontWeight: "bold" }}>
                                                    {column}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => (
                                            <TableRow
                                                key={index}
                                                hover
                                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                            >
                                                {columns.map((column) => (
                                                    <TableCell key={`${index}-${column}`}>
                                                        {(column === "end_date" || column === "start_date") && typeof row[column] === "number"
                                                            ? excelDateToJSDate(row[column]).toLocaleDateString() // Hiển thị ngày tháng dễ đọc
                                                            : row[column]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    Insert
                                </Button>
                            </Box>
                        </>
                    )}

                    {data.length === 0 && (
                        <>
                            <Typography variant="body1" color="textSecondary" align="center">
                                No data uploaded. Please upload an Excel file.
                            </Typography>
                            <Typography variant="body1" color="textSecondary" align="center">
                                The file must include the following
                                <span style={{ color: '#f50057', fontWeight: 'bold' }}> mandatory columns</span>:
                                <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> list</span>,
                                <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> task</span>,
                                <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> start_date</span>,
                                and <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> end_date</span>.
                                In addition, there can be optional columns such as
                                <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> description</span>,
                                <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> status</span>
                                (<span style={{ color: '#f50057', fontWeight: 'bold' }}> mandatory values</span>:
                                [<span style={{ color: '#ff4081', fontWeight: 'bold' }}> To Do</span>,
                                <span style={{ color: '#ff4081', fontWeight: 'bold' }}> In Progress</span>,
                                <span style={{ color: '#ff4081', fontWeight: 'bold' }}> Completed</span>]),
                                and <span style={{ color:'#3f51b5' , fontWeight: 'bold' }}> priority</span>
                                (<span style={{ color: '#f50057', fontWeight: 'bold' }}> mandatory values</span>:
                                [<span style={{ color: '#ff4081', fontWeight: 'bold' }}> Low</span>,
                                <span style={{ color: '#ff4081', fontWeight: 'bold' }}> Medium</span>,
                                <span style={{ color: '#ff4081', fontWeight: 'bold' }}> High</span>]).
                            </Typography>


                        </>
                    )}
                </Box>
            </Card>
        </>
    );
};

export default ImportProject;

