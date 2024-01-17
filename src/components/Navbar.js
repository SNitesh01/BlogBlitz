"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useRouter } from "next/navigation";

const Header = () => {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    });
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" >
      <Container>
        <Navbar.Brand href="/">BlogBlitz</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {login ? (
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Link className="nav-link" href="/blogs">
                Blogs
              </Link>
              <Link
                className="nav-link"
                href="/"
                onClick={async () => {
                  await auth.signOut();
                  router.push("/");
                }}
              >
                Logout
              </Link>
            </Nav>
          ) : (
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="nav-link" href="/register">
                Register
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
