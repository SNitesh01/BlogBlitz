"use client";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import avtaricon from "../../../public/images/useravtat.png";
import Image from "next/image";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Index = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = userCredential.user;
        localStorage.setItem("token", result.accessToken);
        toast.success("User Login Successfully");
        router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h3 className="text-start">Login !!</h3>
          <p className="text-muted">
            Log in to share your thoughts and experiences with the community.
            Once logged in, you can create a new blog post below.
          </p>
          <div className="card">
            <div className="text-center">
              <Image
                src={avtaricon}
                id="imageAsBackground"
                alt="img"
                height={90}
                width={90}
              />
            </div>
            <div className="card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label>Enter Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="invalid-feedback">
                      {formik.errors.email}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label>Enter Your Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <span className="invalid-feedback">
                      {formik.errors.password}
                    </span>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
              <div className="mt-3">
                Does not have account? <Link href="/register">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
