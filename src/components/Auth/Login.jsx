import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import User from '../../assets/User'
import Logo from '../../assets/Logo'
import api from '../modules/Api'
import Close from '../../assets/Eyeclose';
import Show from '../../assets/Eyeopen';


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };



    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(api + 'api/login', data);

            if (response.status === 200) {
                localStorage.clear();
                if (data.username.trim() === "Master") {
                    await axios.get(api + "api/getallusers")

                        .then((response) => {
                            ("All Users:", response.data);
                            localStorage.setItem("allUsers", JSON.stringify(response.data));
                        })
                        .catch((error) => {
                            console.error("Error fetching all users:", error);
                            // alert("Something went wrong fetching all users.");
                        });
                    await axios.get(api + "api/getAllAsset")

                        .then((response) => {
                            ("All Assets:", response.data);
                            localStorage.setItem("getAllAssets", JSON.stringify(response.data));
                        })
                        .catch((error) => {
                            console.error("Error fetching all assets:", error);
                            // alert("Something went wrong fetching all assets.");
                        });
                    await axios.get(api + "api/getAllClients")

                        .then((response) => {
                            ("All customers:", response.data);
                            localStorage.setItem("AllClients", JSON.stringify(response.data));
                        })
                        .catch((error) => {
                            console.error("Error fetching all assets:", error);
                            // alert("Something went wrong fetching all assets.");
                        });
                    await axios.post(api + "api/getAllTickets", { username: data.username })

                        .then((response) => {
                            // ("All customers:", response.data);
                            localStorage.setItem("AllTickets", JSON.stringify(response.data));
                        })
                        .catch((error) => {
                            console.error("Error fetching all tickets:", error);
                            // alert("Something went wrong fetching all Tickets.");
                        });

                }
                await axios.get(api + "api/getOptionUsers")

                    .then((response) => {
                        localStorage.setItem("onlyUsers", JSON.stringify(response.data));
                    })
                    .catch((error) => {
                        console.error("Error fetching only users:", error);
                        // alert("Something went wrong fetching only users.");
                    });
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
        <div className=' w-screen '>
            <div className='text-black flex bg-page-gradient items-center justify-center flex-col p-12  md:m-auto h-screen md:shadow-customBlue md:scale-[.7] md:rounded-[100px] md:w-[34vw]'>
                {/* <h2 className="text-2xl text font-bold mb-5 text-center">Binary systems Login</h2> */}
                {/* <img src="/src/assets/logo.jpeg" alt="Logo..." className='md:scale-[.7] scale-[.6]' /> */}
                {/* <img src={Logo} alt="Logo..." className='md:scale-[.7] scale-[.6]' /> */}
                <Logo />
                <div className='icon'>
                    <lord-icon
                        src="https://cdn.lordicon.com/hrjifpbq.json"
                        trigger="hover"
                    >
                    </lord-icon>
                </div>
                <div className="p-6  text-black rounded-lg /shadow-lg">
                    <h1 className='font-bold text-2xl w-fit my-4     m-auto'>Login</h1>
                    {loading ? (
                        <div className="flex justify-center items-center gap-3">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full border-black" role="status">
                            </div>
                            <span className="breathing">Loading...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                            <div className="mb-4">
                                <input
                                    className="w-[350px] px-3 py-2 my-3  rounded-lg border-gray-500 border-2 focus:outline-none focus:border-blue-500 h-14 "
                                    type="text"
                                    id="username"
                                    placeholder='Username'
                                    {...register('username', { required: 'Username is required' })}
                                    autoComplete="off"
                                />
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                            </div>
                            <div className="mb-4 relative">
                                <input
                                    className="w-full px-3 py-2 my-3  rounded-lg border-gray-500 border-2 focus:outline-none focus:border-blue-500 h-14"
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    placeholder='Password'
                                    {...register('password', { required: 'Password is required' })}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black scale-[.3]"
                                >
                                    {passwordVisible ? <Show /> : <Close /> }
                                </button>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>
                            <button
                                className="w-[300px] m-auto my-16 block bg-blue-400 text-white py-2 rounded-md hover:bg-blue-300 transition duration-200"
                                type="submit"
                            >
                                Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Login;
