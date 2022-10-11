import React, { useState, useEffect } from 'react';
import axios from "axios";
import ReactPaginate from "react-paginate";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState();

    let source = axios.CancelToken.source();

    useEffect(() => {
        getUsers()

        return () => {
            source.cancel();
        }
    }, [page, keyword, loading]);

    const getUsers = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=${limit}&search=${keyword}`, {
                cancelToken: source.token
            });
            setLoading(false);
            setUsers(data.data.users);
            setPage(data.pagination.page);
            setLimit(data.pagination.limit);
            setOffset(data.pagination.offset);
            setPages(data.pagination.totalPages);
            setRows(data.pagination.totalRows);
        } catch (e) {
            setLoading(false);
            if (axios.isCancel(e)) console.log('Request canceled');
            if (e.response) setErr(e.response.data);
            console.log(e);
        }
    };

    const changePage = ({ selected }) => {
        setPage(selected + 1);
        setLoading(true);
        if (selected === 24) {
            setMsg("You have reached the end of the user list. Please use search feature if you want to find a specific user.");
        } else {
            setMsg("");
        }
    }

    const submitSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setKeyword(query);
        setMsg("");
        setLoading(true);
    }

    return (
        <>
            <div className="container">
                <h1 className="text-center fw-bold mt-5">
                    React Pagination
                </h1>
                <div className="row">
                    <div className="col-md-12 mt-4">
                        {
                            err && (
                                <div className="alert alert-danger">
                                    <strong>"{err.status}" </strong>
                                    {err.message} Code: {err.code}
                                </div>
                            )
                        }
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="fw-semibold fs-5">Users{keyword && (`, with keyword "${keyword}"`)}</div>
                            <form onSubmit={submitSearch} className="d-flex justify-content-between align-items-center">
                                <input type="text"
                                       className="form-control me-2"
                                       value={query}
                                       onChange={(e) => setQuery(e.target.value)}
                                       placeholder="Search name or email"/>
                                <button className="btn btn-primary" disabled={loading}>Search</button>
                            </form>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table my-0 table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        { loading && (
                                            <tr>
                                                <td colSpan="4">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <img src="/loading.svg" width={22} height={22} alt="loading" className="me-1"/>
                                                        Please wait . . .
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {
                                           !loading && (
                                                users.length > 0
                                                    ? (users.map((user, index) => (
                                                            <tr key={index}>
                                                                <td>{index + offset + 1}</td>
                                                                <td>{user.name}</td>
                                                                <td>{user.email}</td>
                                                                <td>{user.gender}</td>
                                                            </tr>
                                                        ))
                                                    )
                                                    : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">No users found</td>
                                                        </tr>
                                                    )
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <small>Showing {users.length > 0 ? offset + 1 : 0} to {offset + users.length} of {rows} entries, page {page} of {pages}</small>
                            <nav aria-label="pagination" key={rows}>
                                <ReactPaginate
                                    previousLabel={"Prev"}
                                    nextLabel={"Next"}
                                    pageCount={Math.min(25, pages)}
                                    onPageChange={changePage}
                                    containerClassName={"pagination pagination-sm my-0"}
                                    activeClassName={"active"}
                                    pageLinkClassName={"page-link"}
                                    previousLinkClassName={"page-link"}
                                    nextLinkClassName={"page-link"}
                                    disabledClassName={"disabled"}
                                />
                            </nav>
                        </div>
                        {
                            msg && <small className="d-flex justify-content-center text-danger mt-2">{msg}</small>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserList;
