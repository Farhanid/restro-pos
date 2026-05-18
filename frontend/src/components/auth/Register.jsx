import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { register } from "../../https";
import { enqueueSnackbar } from "notistack";

const Register = ({ setIsRegister }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role: role.toLowerCase() })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        registerMutation.mutate(formData)
        // Here you would make an API call to register the user
    }
    const registerMutation = useMutation({
        mutationFn: (reqData) => register(reqData),
        onSuccess: (res) => {
            const { data } = res;
            console.log(data)
            enqueueSnackbar(data.message, { variant: "success" })
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                role: ""
            });

            setTimeout(() => {
                setIsRegister(false)
            }, 1500)



        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" })
        }
    })

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Employee Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter employee name"
                        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-md outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
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
                {/* Phone */}
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Employee Phone
                    </label>
                    <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter employee phone"
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
                {/* Role */}
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Choose your Role
                    </label>
                    <div className="flex items-center gap-4 mt-4">
                        {["Waiter", "Cashier", "Admin"].map((r) => (
                            <button
                                type="button"
                                key={r}
                                onClick={() => handleRoleSelect(r)}
                                className={`px-4 py-2 rounded-md ${formData.role === r.toLowerCase()
                                    ? "bg-blue-600 text-black"
                                    : "bg-[#1f1f1f] text-white"
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
};

export default Register;