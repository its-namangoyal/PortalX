import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Login } from "../redux/userSlice";
import { apiRequest } from "../utils";
import CustomButton from "./CustomButton";
import Loading from "./Loading";
import TextInput from "./TextInput";

const SignUp = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [accountType, setAccountType] = useState("seeker");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm({ mode: "onChange" });
  
  const closeModal = () => setOpen(false);
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    let URL = isRegister ? 
      accountType === "seeker" ? "auth/register" : accountType === "company" ? "companies/register" : "admin/register" 
      : accountType === "seeker" ? "auth/login" : accountType === "company" ? "companies/login" : "admin/login";

    try {
      const res = await apiRequest({ url: URL, data, method: "POST" });
      
      if (res?.status === "failed") {
        setErrMsg(res?.message);
      } else {
        if (isRegister) {
          setErrMsg(res?.message);
          setTimeout(() => window.location.replace("/"), 5000);
        } else {
          setErrMsg("");
          const newData = { token: res?.token, ...res?.user };
          dispatch(Login(newData));
          localStorage.setItem("userInfo", JSON.stringify(newData));
          window.location.replace(accountType === "seeker" ? "/find-projects" : "/projects");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountTypeFields = () => {
    if (accountType === "seeker" || accountType === "admin") {
      return (
        <div className="w-full flex gap-1 md:gap-2">
          <div className="w-1/2">
            <TextInput
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              type="text"
              register={register("firstName", { required: "First Name is required" })}
              error={errors.firstName ? errors.firstName.message : ""}
            />
          </div>
          <div className="w-1/2">
            <TextInput
              name="lastName"
              label="Last Name"
              placeholder="Enter Last Name"
              type="text"
              register={register("lastName", { required: "Last Name is required" })}
              error={errors.lastName ? errors.lastName.message : ""}
            />
          </div>
        </div>
      );
    } else if (accountType === "company") {
      return (
        <div className="w-full">
          <TextInput
            name="name"
            label="Company/Professor Name"
            placeholder="Company/Professor Name"
            type="text"
            register={register("name", { required: "Company Name is required" })}
            error={errors.name ? errors.name.message : ""}
          />
        </div>
      );
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
                <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                  {isRegister ? "Create Account" : "Account Sign In"}
                </Dialog.Title>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="seeker">Student Account</option>
                    <option value="company">Company / Professor Account</option>
                    <option value="admin">Admin Account</option>
                  </select>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  <TextInput
                    name="email"
                    label="Email Address"
                    placeholder="email@uwindsor.ca"
                    type="email"
                    register={register("email", {
                      required: "Email Address is required!",
                      pattern: {
                        value: accountType === "seeker" 
                          ? /^[a-zA-Z0-9._%+-]+@uwindsor\.ca$/i 
                          : /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/i,
                        message: accountType === "seeker" 
                          ? "Email must be a valid '@uwindsor.ca' address" 
                          : "Enter a valid email address",
                      },
                    })}
                    error={errors.email ? errors.email.message : ""}
                  />
                  
                  {isRegister && renderAccountTypeFields()}

                  <div className="mt-4 space-y-2">
                    <TextInput
                      name="password"
                      label="Password"
                      placeholder="Enter Password"
                      type="password"
                      register={register("password", { required: "Password is required" })}
                      error={errors.password ? errors.password.message : ""}
                    />
                    {isRegister && (
                      <TextInput
                        name="cPassword"
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        type="password"
                        register={register("cPassword", {
                          validate: value => value === getValues("password") || "Passwords do not match"
                        })}
                        error={errors.cPassword ? errors.cPassword.message : ""}
                      />
                    )}
                  </div>

                  {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}
                  <div className="mt-6">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <CustomButton
                        type="submit"
                        containerStyles="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        title={isRegister ? "Create Account" : "Login Account"}
                      />
                    )}
                  </div>
                </form>

                <div className="mt-4 text-sm text-center">
                  {isRegister ? (
                    <p>
                      Already have an account?{" "}
                      <span
                        onClick={() => setIsRegister(false)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Sign In
                      </span>
                    </p>
                  ) : (
                    <p>
                      Don't have an account?{" "}
                      <span
                        onClick={() => setIsRegister(true)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Create Account
                      </span>
                    </p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignUp;