import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { login } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData)
        // Here you would make an API call to login the user
    }
    const loginMutation = useMutation({
        mutationFn: (reqData) => login(reqData),
        onSuccess: (res) => {
            const { data } = res;
            console.log(data)
            const { _id, name, email, phone, role } = data.data;
            dispatch(setUser({ _id, name, email, phone, role }))
            navigate("/")
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" })
        }
    })
    
    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Employee Email
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter employee email"
                        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-md outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Password
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-md outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition"
                >
                    Sign In
                </button>

            </form>
        </div>
    )
}

export default Login