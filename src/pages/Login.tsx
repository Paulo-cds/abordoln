import LoginComponent from "../components/LoginComponent";

const Login = () => {
    return(
        <LoginComponent
            action={() => {
                window.location.href = "/";
            }}
        />
    )
}

export default Login;