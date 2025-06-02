import React, { useState, useRef } from "react";
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
import { apiRegisterWithEmail } from "~/apis/Auth/authService";
import { toast } from "react-toastify";

const AddUserFile = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const fileInputRef = useRef(null);
    const [failedUsers, setFailedUsers] = useState([]);
    const [successUsers, setSuccessUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

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

    const handleClearData = () => {
        setData([]);
        setColumns([]);
        setFailedUsers([]);
        setSuccessUsers([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (data.length === 0) {
            toast.error("No data to submit");
            return;
        }

        const failed = [];
        const success = [];

        try {
            setLoading(true);
            await Promise.all(
                data.map(async (user, index) => {
                    try {
                        const res = await apiRegisterWithEmail(
                            user.name,
                            user.email,
                            user.password
                        );
                        if (res) {
                            success.push(user);
                        } else {
                            failed.push(index);
                        }
                    } catch (error) {
                        failed.push(index);
                    }
                })
            );

            setFailedUsers(failed);
            setSuccessUsers(success);
            console.log(success,'sssss');
            if (success.length > 0) {
                toast.success(`${success.length} users added successfully`);
            }
            if (failed.length > 0) {
                toast.error(`${failed.length} users failed to register`);
            }
            setData([]);
            setColumns([]);
            setFailedUsers([]);
            setSuccessUsers([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setLoading(false);
        } catch (error) {
            console.error("Bulk user registration error:", error);
            toast.error("Failed to process user registrations");
        }
    };

    return (
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
                                                    {row[column]}
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
                                disabled={loading}
                            >
                                {loading ? 'Inserting...' : 'Insert'}
                            </Button>
                        </Box>
                        {failedUsers.length > 0 && (
                            <Typography
                                variant="body1"
                                color="error"
                                align="center"
                                sx={{ mt: 2 }}
                            >
                                STT  {failedUsers.map(c => `${c}, `)}  users failed to register
                            </Typography>
                        )}
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
                            <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> name</span>,
                            <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> email</span>,
                            <span style={{ color: '#3f51b5', fontWeight: 'bold' }}> password</span>,
                           
                        </Typography>
                    </>
                )}
            </Box>
        </Card>
    );
};

export default AddUserFile;

