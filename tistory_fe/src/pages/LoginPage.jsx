import React, { useState } from "react";
import api from "../api/axios";

export default function LoginPage({ onNavigate }) {
  const [tab, setTab] = useState("email");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "이메일을 입력해주세요.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다.";
    if (!form.password) errs.password = "비밀번호를 입력해주세요.";
    else if (form.password.length < 6) errs.password = "비밀번호는 6자 이상이어야 합니다.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { accessToken, refreshToken, member } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userNickname", member.nickname);

      alert(`${member.nickname}님, 환영합니다!`);
      onNavigate("home");
    } catch (error) {
      const message = error.response?.data?.message || "로그인에 실패했습니다. 정보를 확인해주세요.";
      setErrors({ server: message });
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr) => ({
    width: "100%",
    height: 48,
    padding: "0 14px",
    border: `1px solid ${hasErr ? "#e24b4a" : "#ddd"}`,
    borderRadius: 6,
    fontSize: 14,
    color: "#191919",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Noto Sans KR', sans-serif",
    transition: "border-color 0.2s",
    background: "#fff",
  });

  return (
      <div style={{
        minHeight: "100vh",
        background: "#f8f8f6",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Mini GNB */}
        <nav style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}>
          <button
              onClick={() => onNavigate("home")}
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 20,
                fontWeight: 600,
                color: "#ff5733",
                letterSpacing: "-0.5px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
          >
            Tis<span style={{ color: "#191919" }}>tory</span>
          </button>
        </nav>

        {/* Card */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}>
          <div style={{
            width: "100%",
            maxWidth: 440,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            padding: "40px 40px 36px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 26,
                fontWeight: 600,
                color: "#ff5733",
                marginBottom: 8,
              }}>
                Tis<span style={{ color: "#191919" }}>tory</span>
              </div>
              <p style={{ fontSize: 14, color: "#888" }}>블로그로 세상과 소통하세요</p>
            </div>

            {/* Tab */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid #e8e8e8",
              marginBottom: 28,
            }}>
              {[["email", "이메일 로그인"], ["kakao", "카카오 로그인"]].map(([key, label]) => (
                  <button
                      key={key}
                      onClick={() => { setTab(key); setErrors({}); }}
                      style={{
                        flex: 1,
                        padding: "12px 0",
                        fontSize: 14,
                        fontWeight: tab === key ? 700 : 400,
                        color: tab === key ? "#ff5733" : "#888",
                        background: "none",
                        border: "none",
                        borderBottom: tab === key ? "2px solid #ff5733" : "2px solid transparent",
                        cursor: "pointer",
                        marginBottom: -1,
                        fontFamily: "'Noto Sans KR', sans-serif",
                        transition: "all 0.2s",
                      }}
                  >
                    {label}
                  </button>
              ))}
            </div>

            {tab === "email" ? (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#444", marginBottom: 6, fontWeight: 500 }}>
                      이메일
                    </label>
                    <input
                        type="email"
                        placeholder="이메일 주소 입력"
                        value={form.email}
                        onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                        style={inputStyle(!!errors.email)}
                        onFocus={(e) => (e.target.style.borderColor = errors.email ? "#e24b4a" : "#ff5733")}
                        onBlur={(e) => (e.target.style.borderColor = errors.email ? "#e24b4a" : "#ddd")}
                    />
                    {errors.email && (
                        <p style={{ fontSize: 12, color: "#e24b4a", marginTop: 5 }}>{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#444", marginBottom: 6, fontWeight: 500 }}>
                      비밀번호
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                          type={showPw ? "text" : "password"}
                          placeholder="비밀번호 입력"
                          value={form.password}
                          onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                          style={{ ...inputStyle(!!errors.password), paddingRight: 44 }}
                          onFocus={(e) => (e.target.style.borderColor = errors.password ? "#e24b4a" : "#ff5733")}
                          onBlur={(e) => (e.target.style.borderColor = errors.password ? "#e24b4a" : "#ddd")}
                      />
                      <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 16,
                            color: "#aaa",
                            padding: 4,
                          }}
                      >
                        {showPw ? "🙈" : "👁"}
                      </button>
                    </div>
                    {errors.password && (
                        <p style={{ fontSize: 12, color: "#e24b4a", marginTop: 5 }}>{errors.password}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666", cursor: "pointer" }}>
                      <input type="checkbox" style={{ accentColor: "#ff5733" }} />
                      자동 로그인
                    </label>
                    <a href="#" style={{ fontSize: 13, color: "#888" }}>비밀번호 찾기</a>
                  </div>

                  {/* Submit */}
                  <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: "100%",
                        height: 48,
                        background: loading ? "#ffb3a0" : "#ff5733",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 6,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "'Noto Sans KR', sans-serif",
                        transition: "background 0.2s",
                        letterSpacing: "0.3px",
                      }}
                  >
                    {loading ? "로그인 중..." : "로그인"}
                  </button>

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "#eee" }} />
                    <span style={{ fontSize: 12, color: "#bbb" }}>또는</span>
                    <div style={{ flex: 1, height: 1, background: "#eee" }} />
                  </div>

                  {/* SNS */}
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { label: "카카오", bg: "#FEE500", color: "#191919", emoji: "🟡" },
                      { label: "구글", bg: "#fff", color: "#444", emoji: "🔵", border: "1px solid #ddd" },
                      { label: "네이버", bg: "#03C75A", color: "#fff", emoji: "🟢" },
                    ].map(({ label, bg, color, emoji, border }) => (
                        <button
                            key={label}
                            type="button"
                            style={{
                              flex: 1,
                              height: 44,
                              background: bg,
                              color,
                              fontSize: 13,
                              border: border || "none",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontFamily: "'Noto Sans KR', sans-serif",
                              fontWeight: 500,
                            }}
                        >
                          {label}
                        </button>
                    ))}
                  </div>
                </form>
            ) : (
                /* Kakao Tab */
                <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🟡</div>
                  <p style={{ fontSize: 14, color: "#555", marginBottom: 24, lineHeight: 1.6 }}>
                    카카오 계정으로 간편하게<br />로그인하세요
                  </p>
                  <button style={{
                    width: "100%",
                    height: 48,
                    background: "#FEE500",
                    color: "#191919",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>
                    카카오로 시작하기
                  </button>
                </div>
            )}

            {/* Signup link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 24 }}>
              아직 회원이 아닌가요?{" "}
              <button
                  onClick={() => onNavigate("signup")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ff5733", fontWeight: 600, fontSize: 13, fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
  );
}