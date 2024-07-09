import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data) => {
        setLoading(true);
        try {
            console.log(data);
            const response = await axios.post('https://binarysystemsbackend-mtt8.onrender.com/api/login', data);
            if (response.status === 200) {
                console.log(response.data);
                localStorage.removeItem("allUsers");
                if (data.username.trim() === "Master") {
                    await axios.get("https://binarysystemsbackend-mtt8.onrender.com/api/getallusers")
                        .then((response) => {
                            console.log("All Users:", response.data);
                            localStorage.setItem("allUsers", JSON.stringify(response.data));
                        })
                        .catch((error) => {
                            console.error("Error fetching all users:", error);
                            alert("Something went wrong fetching all users.");
                        });
                }
                localStorage.setItem("userDet", JSON.stringify(response.data));
                navigate('/server/Home');
            } else {
                alert("Invalid login Credentials");
            }
        } catch (err) {
            console.error('Login failed. Please check your credentials.');
            alert(err.response?.data.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-slate-800 h-screen flex items-center justify-center flex-col p-12 w-screen'>
            <h2 className="text-2xl text font-bold mb-5 text-center">Binary systems Login</h2>

            <div className='icon'>
                <lord-icon
                    src="https://cdn.lordicon.com/hrjifpbq.json"
                    trigger="hover"
                    colors="primary:#ffffff"
                >
                </lord-icon>
            </div>
            <div className="p-6 bg-slate-800 text-white rounded-lg shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center gap-3">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full" role="status">
                        </div>
                        <span className="breathing">Loading...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="mb-4">
                            <input
                                className="w-[350px] px-3 py-2 my-3 bg-transparent rounded-lg border-2 focus:outline-none focus:border-blue-500 h-14"
                                type="text"
                                id="username"
                                placeholder='Username'
                                {...register('username', { required: 'Username is required' })}
                                autoComplete="off"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                        </div>
                        <div className="mb-4">
                            <input
                                className="w-full px-3 py-2 my-3 bg-transparent rounded-lg border-2 focus:outline-none focus:border-blue-500 h-14"
                                type="password"
                                id="password"
                                placeholder='Password'
                                {...register('password', { required: 'Password is required' })}
                                autoComplete="off"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        <button
                            className="w-[300px] m-auto my-16 block bg-slate-200 text-black py-2 rounded-md hover:bg-slate-400 transition duration-200"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
