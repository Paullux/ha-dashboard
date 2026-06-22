import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import "./LoginPage.css";
export function LoginPage({ onLogin }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const err = await onLogin(password);
        if (err) {
            setError(err);
            setPassword("");
        }
        setLoading(false);
    };
    return (_jsx("div", { className: "login-bg", children: _jsxs("div", { className: "login-card", children: [_jsx("div", { className: "login-logo", children: "\uD83C\uDFE0" }), _jsx("h1", { className: "login-title", children: "Dashboard" }), _jsx("p", { className: "login-sub", children: "Bienvenue, Paul" }), _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "login-field", children: [_jsx("label", { htmlFor: "password", children: "Mot de passe" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoFocus: true, autoComplete: "current-password", disabled: loading })] }), error && _jsx("p", { className: "login-error", children: error }), _jsx("button", { className: "login-btn", type: "submit", disabled: loading || !password, children: loading ? "Connexion…" : "Se connecter" })] })] }) }));
}
