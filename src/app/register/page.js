"use client";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import avtaricon from "../../../public/images/useravtat.png";
import Image from "next/image";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
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
        const { email, password, name } = values;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: name,
        });
        toast.success("User Register Successfully");
        router.push("/login");
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h3 className="text-start">Register !!</h3>
          <p className="text-muted">
            New to our community? Register now to join and start sharing your
            experiences.
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
                  <label>Enter Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className="invalid-feedback">
                      {formik.errors.name}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label>Enter Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
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
                    value={formik.values.password}
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
                Already have account? <Link href="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
