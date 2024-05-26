import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import UserContext from "../components/usercontext";
import axios from "axios";
import Header from "../components/header";

const MyPage = () => {
    const navigate=useNavigate();
    const [password, setPassword]=useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [studentId, setStudentId] = useState("");
    const [major, setMajor] = useState("");
    const [major2, setMajor2] = useState("");
    const { user,setUser } = useContext(UserContext);
    useEffect(() => {
        if (user && user.id){
            fetch("http://localhost:8000/get-user", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({id:user.id}),
            })
                .then((response)=>response.json())
                .then((response) => {
                    setName(response.name);
                    setEmail(response.email);
                    setStudentId(response.student_id);
                    setMajor(response.major);
                    setMajor2(response.major2);
                    setPassword(response.password);
                })
                .catch((err) => {
                    console.error("Error fetching from DB", err);
                });
        }

    }, [user]);

    useEffect(() => {
        window.localStorage.setItem("id", user.id);
    }, [user]);

    useEffect(()=>{
        console.log(user);
    },[user]);

    return (
        <>
        <Header />
        <div className="form">
            <p>아이디: {user.id}</p>
            <p>
                비밀번호 확인: <input
                    className=""
                    type="password"
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
            </p>
            <p>
                이름:{" "}
                <input
                    className=""
                    type="text"
                    defaultValue={user.name}
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
            </p>
            <p>
                이메일:{" "}
                <input
                    className=""
                    type="text"
                    defaultValue={user.email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
            </p>
            <p>
                학번:{" "}
                <input
                    className=""
                    type="text"
                    defaultValue={user.student_id}
                    onChange={(event) => {
                        setStudentId(event.target.value);
                    }}
                />
            </p>
            <p>
                주전공(소속) - 정식 학과명으로 작성:{" "}
                <input
                    className=""
                    type="text"
                    defaultValue={user.major}
                    onChange={(event) => {
                        setMajor(event.target.value);
                    }}
                />
            </p>
            <p>
                복수전공/부전공 - 정식 학과명으로 작성(없을 시 공란):{" "}
                <input
                    className=""
                    type="text"
                    defaultValue={user.major2}
                    onChange={(event) => {
                        setMajor2(event.target.value);
                    }}
                />
            </p>

            <p>
                <input
                    className="btn"
                    type="submit"
                    value="완료"
                    onClick={() => {
                        const userData = {
                            id: user.id,
                            name: name,
                            email: email,
                            studentId: studentId,
                            major: major,
                            major2: major2,
                        };
                        fetch("http://localhost:8000/change-user-info", {
                            method: "post",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(userData),
                        })
                            .then((res) => res.json())
                            .then((json) => {
                                if (json.isSuccess === "True") {
                                    setUser(userData);
                                    navigate("/mypage");
                                } else {
                                    alert(json.isSuccess);
                                }
                            });
                    }}
                />
            </p>
        </div></>
    );
}
export default MyPage;
