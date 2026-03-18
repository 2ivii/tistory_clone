import React, { useState, useRef } from "react";

/* ─── 상수 ──────────────────────────────────────────── */
const STEPS = ["약관 동의", "기본 정보", "블로그 설정", "완료"];

const TERMS = [
  {
    id: "service", required: true,
    title: "[필수] 티스토리 서비스 이용약관 동의",
    body: "제1조 (목적)\n이 약관은 카카오 주식회사(이하 '회사')가 제공하는 티스토리 서비스 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n① 서비스란 회사가 제공하는 블로그 플랫폼 서비스 및 그와 관련된 제반 서비스를 말합니다.\n② 이용자란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.\n\n제3조 (약관의 효력 및 변경)\n① 이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.\n② 회사는 관련법을 위배하지 않는 범위 내에서 이 약관을 개정할 수 있습니다.",
  },
  {
    id: "privacy", required: true,
    title: "[필수] 개인정보 수집 및 이용 동의",
    body: "1. 수집하는 개인정보 항목\n- 필수항목: 이메일 주소, 비밀번호, 닉네임\n- 선택항목: 프로필 이미지, 블로그 소개글\n\n2. 개인정보 수집 및 이용 목적\n- 회원 가입 및 관리, 서비스 제공, 고객 문의 응대\n\n3. 개인정보 보유 및 이용 기간\n- 회원 탈퇴 시까지 보유·이용합니다.",
  },
  {
    id: "location", required: false,
    title: "[선택] 위치 기반 서비스 이용 동의",
    body: "위치 기반 서비스를 이용하면 가까운 지역 블로그 콘텐츠를 추천받을 수 있습니다.\n이 항목은 선택사항으로, 동의하지 않아도 회원가입이 가능합니다.",
  },
  {
    id: "marketing", required: false,
    title: "[선택] 마케팅 정보 수신 동의",
    body: "이벤트, 프로모션, 혜택 정보를 이메일·알림으로 받아보실 수 있습니다.\n이 항목은 선택사항으로, 동의하지 않아도 회원가입이 가능합니다.",
  },
];

const PW_RULES = [
  { label: "8자 이상",     test: v => v.length >= 8 },
  { label: "영문 포함",    test: v => /[a-zA-Z]/.test(v) },
  { label: "숫자 포함",    test: v => /[0-9]/.test(v) },
  { label: "특수문자 포함", test: v => /[^a-zA-Z0-9]/.test(v) },
];

const PROFILE_EMOJIS = ["👩‍💻","🧑‍💻","👨‍🎨","🦊","🐱","🐶","🌱","🌊","🌙","⚡","🎯","🚀"];
const YEARS  = Array.from({ length: 80 }, (_, i) => 2024 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);

/* ─── 공통 스타일 ────────────────────────────────────── */
const card = {
  width: "100%", maxWidth: 560,
  background: "#fff", border: "1px solid #e8e8e8",
  borderRadius: 14, padding: "40px 44px 36px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
};
const lbl = { display: "block", fontSize: 13, fontWeight: 500, color: "#444", marginBottom: 7 };
const errMsg = { fontSize: 12, color: "#e24b4a", marginTop: 5 };
const okMsg  = { fontSize: 12, color: "#3b6d11", marginTop: 5 };

const fieldBase = (err, disabled) => ({
  width: "100%", height: 48, padding: "0 14px",
  border: `1px solid ${err ? "#e24b4a" : "#ddd"}`,
  borderRadius: 7, fontSize: 14, color: "#191919",
  outline: "none", fontFamily: "'Noto Sans KR',sans-serif",
  background: disabled ? "#f5f5f5" : "#fff", boxSizing: "border-box",
});

const btnPrimary = (disabled) => ({
  width: "100%", height: 50,
  background: disabled ? "#ffc9bb" : "#ff5733",
  color: "#fff", fontSize: 15, fontWeight: 700,
  border: "none", borderRadius: 8,
  cursor: disabled ? "not-allowed" : "pointer",
  fontFamily: "'Noto Sans KR',sans-serif",
});

const btnOutline = {
  height: 50, padding: "0 24px",
  background: "#fff", color: "#555", fontSize: 14,
  border: "1px solid #ddd", borderRadius: 8,
  cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif",
};

/* ─── Checkbox ───────────────────────────────────────── */
function Checkbox({ checked, size = 20 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 5, flexShrink: 0,
      background: checked ? "#ff5733" : "#fff",
      border: `2px solid ${checked ? "#ff5733" : "#ccc"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {checked && <span style={{ color: "#fff", fontSize: size * 0.6, fontWeight: 700 }}>✓</span>}
    </div>
  );
}

/* ─── StepIndicator ──────────────────────────────────── */
function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36, width: "100%", maxWidth: 560 }}>
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: (done || active) ? "#ff5733" : "#e8e8e8",
                color: (done || active) ? "#fff" : "#aaa",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                boxShadow: active ? "0 0 0 4px rgba(255,87,51,.15)" : "none",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 11, whiteSpace: "nowrap",
                color: active ? "#ff5733" : done ? "#888" : "#ccc",
                fontWeight: active ? 700 : 400,
              }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: 20,
                margin: "0 6px", marginBottom: 20,
                background: done ? "#ff5733" : "#e8e8e8",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── STEP 0 : 약관 동의 ─────────────────────────────── */
function Step0Terms({ agreed, setAgreed, onNext }) {
  // ✅ 훅은 항상 최상단에만
  const [expanded, setExpanded] = useState({});

  const allRequired = TERMS.filter(t => t.required).every(t => agreed[t.id]);
  const allChecked  = TERMS.every(t => agreed[t.id]);

  const toggleAll    = () => { const v = !allChecked; const o = {}; TERMS.forEach(t => { o[t.id] = v; }); setAgreed(o); };
  const toggleOne    = id => setAgreed(p => ({ ...p, [id]: !p[id] }));
  const toggleExpand = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={card}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>서비스 이용약관</div>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 28 }}>티스토리 서비스를 이용하기 위해 약관에 동의해 주세요.</div>

      {/* 전체 동의 */}
      <div onClick={toggleAll} style={{
        display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
        background: allChecked ? "#fff6f4" : "#f8f8f6", borderRadius: 8,
        border: `1px solid ${allChecked ? "#ffcec4" : "#e8e8e8"}`,
        cursor: "pointer", marginBottom: 16,
      }}>
        <Checkbox checked={allChecked} size={22} />
        <span style={{ fontSize: 15, fontWeight: 700 }}>전체 동의하기</span>
        <span style={{ fontSize: 12, color: "#aaa", marginLeft: "auto" }}>선택 항목 포함</span>
      </div>

      {/* 개별 약관 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TERMS.map(term => (
          <div key={term.id} style={{ border: "1px solid #e8e8e8", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: "#fff" }}>
              <div onClick={() => toggleOne(term.id)} style={{ cursor: "pointer", flexShrink: 0 }}>
                <Checkbox checked={!!agreed[term.id]} size={20} />
              </div>
              <span onClick={() => toggleOne(term.id)} style={{ flex: 1, fontSize: 13, color: "#333", cursor: "pointer", userSelect: "none" }}>
                {term.title}
              </span>
              <button onClick={() => toggleExpand(term.id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#aaa", padding: "2px 6px" }}>
                {expanded[term.id] ? "접기 ▲" : "보기 ▼"}
              </button>
            </div>
            {expanded[term.id] && (
              <div style={{ padding: "14px 16px", background: "#fafafa", borderTop: "1px solid #f0f0f0", fontSize: 12, color: "#666", lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 160, overflowY: "auto" }}>
                {term.body}
              </div>
            )}
          </div>
        ))}
      </div>

      {!allRequired && (
        <p style={{ fontSize: 12, color: "#e24b4a", marginTop: 14 }}>⚠ 필수 약관에 동의해 주세요.</p>
      )}

      <button onClick={onNext} disabled={!allRequired} style={{ ...btnPrimary(!allRequired), marginTop: 28 }}>
        다음 단계
      </button>
    </div>
  );
}

/* ─── STEP 1 : 기본 정보 ─────────────────────────────── */
function Step1Info({ form, setForm, onNext, onPrev }) {
  // ✅ 모든 useState / useRef를 함수 최상단에 모아서 선언
  const [errors,         setErrors]         = useState({});
  const [showPw,         setShowPw]         = useState(false);
  const [showPwc,        setShowPwc]        = useState(false);
  const [emailStatus,    setEmailStatus]    = useState(null);
  const [nicknameStatus, setNicknameStatus] = useState(null);
  const [verifyStep,     setVerifyStep]     = useState("idle");
  const [verifyCode,     setVerifyCode]     = useState("");
  const [timerSec,       setTimerSec]       = useState(0);
  const emailTimer    = useRef(null);
  const nicknameTimer = useRef(null);
  const timerRef      = useRef(null);

  const pwVal      = form.password || "";
  const pwStrength = PW_RULES.filter(r => r.test(pwVal)).length;
  const strColors  = ["#ddd","#e24b4a","#f0992b","#3b9922","#1a7a00"];
  const strLabels  = ["","약함","보통","강함","매우 강함"];

  const fmtTimer = s =>
    `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const checkEmail = val => {
    clearTimeout(emailTimer.current);
    if (!val || !/\S+@\S+\.\S+/.test(val)) { setEmailStatus(null); return; }
    setEmailStatus("checking");
    emailTimer.current = setTimeout(() => {
      setEmailStatus(val === "test@test.com" ? "dup" : "ok");
    }, 700);
  };

  const checkNickname = val => {
    clearTimeout(nicknameTimer.current);
    if (!val || val.length < 2) { setNicknameStatus(null); return; }
    setNicknameStatus("checking");
    nicknameTimer.current = setTimeout(() => {
      setNicknameStatus(val === "관리자" ? "dup" : "ok");
    }, 700);
  };

  const sendCode = () => {
    if (!form.phone) { setErrors(e => ({ ...e, phone: "휴대폰 번호를 입력해주세요." })); return; }
    setVerifyStep("sent");
    setTimerSec(180);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSec(t => {
        if (t <= 1) { clearInterval(timerRef.current); setVerifyStep("idle"); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const confirmCode = () => {
    if (verifyCode === "123456") {
      clearInterval(timerRef.current);
      setVerifyStep("done");
      setForm(f => ({ ...f, verified: true }));
      setErrors(e => ({ ...e, phone: "" }));
    } else {
      setErrors(e => ({ ...e, verifyCode: "인증번호가 올바르지 않습니다." }));
    }
  };

  const handleNext = () => {
    const errs = {};
    if (!form.email)                             errs.email = "이메일을 입력해주세요.";
    else if (!/\S+@\S+\.\S+/.test(form.email))  errs.email = "올바른 이메일 형식이 아닙니다.";
    else if (emailStatus === "dup")              errs.email = "이미 사용 중인 이메일입니다.";

    if (!form.password)       errs.password = "비밀번호를 입력해주세요.";
    else if (pwStrength < 3)  errs.password = "비밀번호 강도가 부족합니다 (3가지 이상 충족).";

    if (!form.passwordConfirm)                       errs.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    else if (form.password !== form.passwordConfirm) errs.passwordConfirm = "비밀번호가 일치하지 않습니다.";

    if (!form.nickname)               errs.nickname = "닉네임을 입력해주세요.";
    else if (form.nickname.length < 2) errs.nickname = "닉네임은 2자 이상이어야 합니다.";
    else if (nicknameStatus === "dup") errs.nickname = "이미 사용 중인 닉네임입니다.";

    if (!form.birthYear || !form.birthMonth || !form.birthDay) errs.birth = "생년월일을 선택해주세요.";
    if (!form.gender)   errs.gender = "성별을 선택해주세요.";
    if (!form.verified) errs.phone  = "휴대폰 인증을 완료해주세요.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  return (
    <div style={card}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>기본 정보 입력</div>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 28 }}>회원가입에 필요한 정보를 입력해 주세요.</div>

      {/* 이메일 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>이메일 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ position: "relative" }}>
          <input type="email" placeholder="example@email.com"
            value={form.email || ""}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(ev => ({ ...ev, email: "" })); checkEmail(e.target.value); }}
            style={{ ...fieldBase(!!errors.email), paddingRight: 100 }}
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12,
            color: emailStatus === "ok" ? "#3b6d11" : emailStatus === "dup" ? "#e24b4a" : "#aaa" }}>
            {emailStatus === "checking" && "확인 중..."}
            {emailStatus === "ok"       && "✓ 사용 가능"}
            {emailStatus === "dup"      && "이미 사용 중"}
          </span>
        </div>
        {errors.email && <div style={errMsg}>⚠ {errors.email}</div>}
      </div>

      {/* 비밀번호 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>비밀번호 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ position: "relative" }}>
          <input type={showPw ? "text" : "password"} placeholder="영문+숫자+특수문자 8자 이상"
            value={pwVal}
            onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(ev => ({ ...ev, password: "" })); }}
            style={{ ...fieldBase(!!errors.password), paddingRight: 44 }}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#bbb" }}>
            {showPw ? "🙈" : "👁"}
          </button>
        </div>
        {pwVal && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
              {[1,2,3,4].map(n => (
                <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= pwStrength ? strColors[pwStrength] : "#eee" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PW_RULES.map(r => (
                  <span key={r.label} style={{ fontSize: 11, color: r.test(pwVal) ? "#3b6d11" : "#bbb" }}>
                    {r.test(pwVal) ? "✓" : "○"} {r.label}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 12, color: strColors[pwStrength], fontWeight: 600 }}>{strLabels[pwStrength]}</span>
            </div>
          </div>
        )}
        {errors.password && <div style={errMsg}>⚠ {errors.password}</div>}
      </div>

      {/* 비밀번호 확인 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>비밀번호 확인 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ position: "relative" }}>
          <input type={showPwc ? "text" : "password"} placeholder="비밀번호를 다시 입력하세요"
            value={form.passwordConfirm || ""}
            onChange={e => { setForm(f => ({ ...f, passwordConfirm: e.target.value })); setErrors(ev => ({ ...ev, passwordConfirm: "" })); }}
            style={{ ...fieldBase(!!errors.passwordConfirm), paddingRight: 44 }}
          />
          <button type="button" onClick={() => setShowPwc(v => !v)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#bbb" }}>
            {showPwc ? "🙈" : "👁"}
          </button>
        </div>
        {errors.passwordConfirm && <div style={errMsg}>⚠ {errors.passwordConfirm}</div>}
        {!errors.passwordConfirm && form.passwordConfirm && form.password === form.passwordConfirm && (
          <div style={okMsg}>✓ 비밀번호가 일치합니다.</div>
        )}
      </div>

      {/* 닉네임 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>닉네임 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ position: "relative" }}>
          <input placeholder="2~12자 (한글, 영문, 숫자)" maxLength={12}
            value={form.nickname || ""}
            onChange={e => { setForm(f => ({ ...f, nickname: e.target.value })); setErrors(ev => ({ ...ev, nickname: "" })); checkNickname(e.target.value); }}
            style={{ ...fieldBase(!!errors.nickname), paddingRight: 110 }}
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12,
            color: nicknameStatus === "ok" ? "#3b6d11" : nicknameStatus === "dup" ? "#e24b4a" : "#ccc" }}>
            {nicknameStatus === "checking" && <span style={{ color: "#aaa" }}>확인 중...</span>}
            {nicknameStatus === "ok"       && "✓ 사용 가능"}
            {nicknameStatus === "dup"      && "이미 사용 중"}
            {!nicknameStatus               && `${(form.nickname || "").length}/12`}
          </span>
        </div>
        {errors.nickname && <div style={errMsg}>⚠ {errors.nickname}</div>}
      </div>

      {/* 생년월일 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>생년월일 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ display: "flex", gap: 8 }}>
          {[["birthYear","년도",YEARS],["birthMonth","월",MONTHS],["birthDay","일",DAYS]].map(([field, ph, opts]) => (
            <select key={field} value={form[field] || ""}
              onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(ev => ({ ...ev, birth: "" })); }}
              style={{ flex: 1, height: 48, padding: "0 8px", border: `1px solid ${errors.birth ? "#e24b4a" : "#ddd"}`, borderRadius: 7, fontSize: 13, color: form[field] ? "#191919" : "#aaa", background: "#fff", fontFamily: "'Noto Sans KR',sans-serif", outline: "none" }}>
              <option value="">{ph}</option>
              {opts.map(o => <option key={o} value={o}>{o}{field === "birthYear" ? "년" : field === "birthMonth" ? "월" : "일"}</option>)}
            </select>
          ))}
        </div>
        {errors.birth && <div style={errMsg}>⚠ {errors.birth}</div>}
      </div>

      {/* 성별 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>성별 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ display: "flex", gap: 8 }}>
          {["남성","여성","선택 안함"].map(g => (
            <button key={g} type="button"
              onClick={() => { setForm(f => ({ ...f, gender: g })); setErrors(ev => ({ ...ev, gender: "" })); }}
              style={{ flex: 1, height: 46, border: "1px solid", borderColor: form.gender === g ? "#ff5733" : "#ddd", borderRadius: 7, background: form.gender === g ? "#fff6f4" : "#fff", color: form.gender === g ? "#ff5733" : "#666", fontSize: 13, fontWeight: form.gender === g ? 700 : 400, cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif" }}>
              {g}
            </button>
          ))}
        </div>
        {errors.gender && <div style={errMsg}>⚠ {errors.gender}</div>}
      </div>

      {/* 휴대폰 인증 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>휴대폰 인증 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="010-0000-0000" maxLength={13}
            value={form.phone || ""}
            disabled={verifyStep === "done"}
            onChange={e => {
              let v = e.target.value.replace(/\D/g,"");
              if (v.length > 3 && v.length <= 7) v = `${v.slice(0,3)}-${v.slice(3)}`;
              else if (v.length > 7) v = `${v.slice(0,3)}-${v.slice(3,7)}-${v.slice(7,11)}`;
              setForm(f => ({ ...f, phone: v }));
              setErrors(ev => ({ ...ev, phone: "" }));
            }}
            style={{ ...fieldBase(!!errors.phone, verifyStep === "done"), flex: 1 }}
          />
          <button type="button" onClick={sendCode} disabled={verifyStep === "done"}
            style={{ height: 48, padding: "0 14px", border: "1px solid #ddd", borderRadius: 7, background: "#fff", color: verifyStep === "done" ? "#bbb" : "#555", fontSize: 13, cursor: verifyStep === "done" ? "not-allowed" : "pointer", fontFamily: "'Noto Sans KR',sans-serif", whiteSpace: "nowrap" }}>
            {verifyStep === "sent" ? "재전송" : verifyStep === "done" ? "인증완료" : "인증번호 전송"}
          </button>
        </div>
        {errors.phone && <div style={errMsg}>⚠ {errors.phone}</div>}
        {verifyStep === "done" && <div style={okMsg}>✓ 휴대폰 인증이 완료되었습니다.</div>}

        {verifyStep === "sent" && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input placeholder="인증번호 6자리" maxLength={6}
                  value={verifyCode}
                  onChange={e => { setVerifyCode(e.target.value.replace(/\D/g,"").slice(0,6)); setErrors(ev => ({ ...ev, verifyCode: "" })); }}
                  style={{ ...fieldBase(!!errors.verifyCode), width: "100%", paddingRight: 64 }}
                />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#e24b4a", fontWeight: 700 }}>
                  {fmtTimer(timerSec)}
                </span>
              </div>
              <button type="button" onClick={confirmCode}
                style={{ height: 48, padding: "0 16px", border: "none", borderRadius: 7, background: "#ff5733", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif" }}>
                확인
              </button>
            </div>
            {errors.verifyCode && <div style={errMsg}>⚠ {errors.verifyCode}</div>}
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>※ 테스트용 인증번호: <b>123456</b></div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <button type="button" onClick={onPrev} style={btnOutline}>이전</button>
        <button type="button" onClick={handleNext} style={{ ...btnPrimary(false), flex: 1 }}>다음 단계</button>
      </div>
    </div>
  );
}

/* ─── STEP 2 : 블로그 설정 ───────────────────────────── */
function Step2Blog({ form, setForm, onNext, onPrev }) {
  // ✅ 훅 최상단 선언
  const [errors,     setErrors]     = useState({});
  const [addrStatus, setAddrStatus] = useState(null);
  const addrTimer = useRef(null);

  const checkAddr = val => {
    clearTimeout(addrTimer.current);
    if (!val || val.length < 3) { setAddrStatus(null); return; }
    if (!/^[a-z0-9-]+$/.test(val)) { setAddrStatus("invalid"); return; }
    setAddrStatus("checking");
    addrTimer.current = setTimeout(() => {
      setAddrStatus(val === "admin" || val === "test" ? "dup" : "ok");
    }, 700);
  };

  const handleNext = () => {
    const errs = {};
    if (!form.blogTitle || form.blogTitle.length < 2) errs.blogTitle = "블로그 이름을 2자 이상 입력해주세요.";
    if (!form.blogAddr || form.blogAddr.length < 3)   errs.blogAddr  = "블로그 주소를 3자 이상 입력해주세요.";
    else if (!/^[a-z0-9-]+$/.test(form.blogAddr))     errs.blogAddr  = "영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.";
    else if (addrStatus === "dup")                     errs.blogAddr  = "이미 사용 중인 주소입니다.";
    else if (addrStatus !== "ok")                      errs.blogAddr  = "주소 중복 확인이 필요합니다.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  const addrBorder = errors.blogAddr ? "#e24b4a" : addrStatus === "ok" ? "#3b9922" : "#ddd";

  return (
    <div style={card}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>블로그 설정</div>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 28 }}>나만의 블로그를 꾸며보세요. 나중에 변경할 수 있습니다.</div>

      {/* 프로필 이모지 */}
      <div style={{ marginBottom: 22 }}>
        <label style={lbl}>프로필 아이콘</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {PROFILE_EMOJIS.map(emoji => (
            <button key={emoji} type="button"
              onClick={() => setForm(f => ({ ...f, profileEmoji: emoji }))}
              style={{ width: 44, height: 44, fontSize: 22, border: "2px solid", borderColor: form.profileEmoji === emoji ? "#ff5733" : "#e8e8e8", borderRadius: 10, background: form.profileEmoji === emoji ? "#fff6f4" : "#fff", cursor: "pointer" }}>
              {emoji}
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 40 }}>{form.profileEmoji || "👩‍💻"}</span>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>선택된 프로필</div>
        </div>
      </div>

      {/* 블로그 이름 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>블로그 이름 <span style={{ color: "#e24b4a" }}>*</span></label>
        <input placeholder="예: 개발자의 일상노트" maxLength={30}
          value={form.blogTitle || ""}
          onChange={e => { setForm(f => ({ ...f, blogTitle: e.target.value })); setErrors(ev => ({ ...ev, blogTitle: "" })); }}
          style={{ ...fieldBase(!!errors.blogTitle), width: "100%" }}
        />
        {errors.blogTitle && <div style={errMsg}>⚠ {errors.blogTitle}</div>}
        <div style={{ fontSize: 12, color: "#ccc", marginTop: 4, textAlign: "right" }}>{(form.blogTitle || "").length}/30</div>
      </div>

      {/* 블로그 주소 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>블로그 주소 <span style={{ color: "#e24b4a" }}>*</span></label>
        <div style={{ display: "flex", alignItems: "center", border: `1px solid ${addrBorder}`, borderRadius: 7, overflow: "hidden", background: "#fff" }}>
          <span style={{ padding: "0 12px", fontSize: 13, color: "#aaa", background: "#fafafa", borderRight: "1px solid #f0f0f0", height: 48, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
            tistory.com/
          </span>
          <input placeholder="my-blog" maxLength={20}
            value={form.blogAddr || ""}
            onChange={e => { const v = e.target.value.toLowerCase(); setForm(f => ({ ...f, blogAddr: v })); setErrors(ev => ({ ...ev, blogAddr: "" })); checkAddr(v); }}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, padding: "0 10px", height: 48, fontFamily: "'Noto Sans KR',sans-serif", color: "#191919", background: "transparent" }}
          />
          <span style={{ padding: "0 12px", fontSize: 12, whiteSpace: "nowrap",
            color: addrStatus === "ok" ? "#3b6d11" : (addrStatus === "dup" || addrStatus === "invalid") ? "#e24b4a" : "#aaa" }}>
            {addrStatus === "checking" && "확인 중..."}
            {addrStatus === "ok"       && "✓ 사용 가능"}
            {addrStatus === "dup"      && "이미 사용 중"}
            {addrStatus === "invalid"  && "형식 오류"}
          </span>
        </div>
        {errors.blogAddr && <div style={errMsg}>⚠ {errors.blogAddr}</div>}
        {addrStatus === "ok" && form.blogAddr && (
          <div style={{ fontSize: 12, color: "#888", marginTop: 6, padding: "6px 10px", background: "#f8f8f6", borderRadius: 6 }}>
            🔗 tistory.com/{form.blogAddr}
          </div>
        )}
        <div style={{ fontSize: 12, color: "#bbb", marginTop: 5 }}>영문 소문자, 숫자, 하이픈(-) · 3~20자</div>
      </div>

      {/* 블로그 소개 */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>블로그 소개 <span style={{ fontSize: 12, color: "#aaa", fontWeight: 400 }}>(선택)</span></label>
        <textarea placeholder="블로그를 간단히 소개해 주세요." maxLength={150} rows={3}
          value={form.blogDesc || ""}
          onChange={e => setForm(f => ({ ...f, blogDesc: e.target.value }))}
          style={{ width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: 7, fontSize: 14, color: "#191919", outline: "none", resize: "none", fontFamily: "'Noto Sans KR',sans-serif", lineHeight: 1.6, boxSizing: "border-box" }}
        />
        <div style={{ fontSize: 12, color: "#ccc", textAlign: "right" }}>{(form.blogDesc || "").length}/150</div>
      </div>

      {/* 테마 */}
      <div style={{ marginBottom: 8 }}>
        <label style={lbl}>블로그 테마</label>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { id:"light", label:"라이트", bg:"#fff",     bar:"#e0e0e0" },
            { id:"dark",  label:"다크",   bg:"#1a1a1a",  bar:"#444"   },
            { id:"warm",  label:"웜톤",   bg:"#fdf6f0",  bar:"#e8d0b8"},
          ].map(t => (
            <div key={t.id} onClick={() => setForm(f => ({ ...f, theme: t.id }))}
              style={{ flex: 1, border: "2px solid", borderColor: form.theme === t.id ? "#ff5733" : "#e8e8e8", borderRadius: 8, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ background: t.bg, padding: "10px 12px" }}>
                <div style={{ width: "60%", height: 5, background: t.bar, borderRadius: 2, marginBottom: 5 }} />
                <div style={{ width: "40%", height: 4, background: t.bar, borderRadius: 2, opacity: 0.5 }} />
              </div>
              <div style={{ padding: "6px 12px", background: t.bg }}>
                <span style={{ fontSize: 11, color: form.theme === t.id ? "#ff5733" : "#aaa", fontWeight: form.theme === t.id ? 700 : 400 }}>{t.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <button type="button" onClick={onPrev} style={btnOutline}>이전</button>
        <button type="button" onClick={handleNext} style={{ ...btnPrimary(false), flex: 1 }}>가입 완료</button>
      </div>
    </div>
  );
}

/* ─── STEP 3 : 완료 ──────────────────────────────────── */
function Step3Done({ form, onNavigate }) {
  const themeLabel = { light:"라이트", dark:"다크", warm:"웜톤" };
  return (
    <div style={{ ...card, textAlign: "center", padding: "52px 44px 44px" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>{form.profileEmoji || "🎉"}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>가입을 환영합니다!</div>
      <div style={{ fontSize: 15, color: "#666", marginBottom: 4 }}>
        <strong style={{ color: "#ff5733" }}>{form.nickname || "회원"}</strong>님의 블로그가 만들어졌어요.
      </div>
      <div style={{ fontSize: 14, color: "#aaa", marginBottom: 32 }}>
        tistory.com/<strong>{form.blogAddr || "my-blog"}</strong>
      </div>

      <div style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 10, padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
        {[
          ["블로그 이름", form.blogTitle  || "-"],
          ["닉네임",     form.nickname   || "-"],
          ["이메일",     form.email      || "-"],
          ["테마",       themeLabel[form.theme] || "라이트"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "7px 0", borderBottom: "1px solid #f5f5f3" }}>
            <span style={{ color: "#999" }}>{k}</span>
            <span style={{ color: "#333", fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>

      <button onClick={() => onNavigate("write")} style={{ ...btnPrimary(false), marginBottom: 10 }}>
        첫 글 작성하기 ✏️
      </button>
      <button onClick={() => onNavigate("home")} style={{ ...btnOutline, width: "100%" }}>
        블로그 홈으로 가기
      </button>
    </div>
  );
}

/* ─── 메인 : SignupPage ──────────────────────────────── */
export default function SignupPage({ onNavigate }) {
  const [step,   setStep]   = useState(0);
  const [agreed, setAgreed] = useState({});
  const [form,   setForm]   = useState({ theme: "light", profileEmoji: "👩‍💻" });

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", height: 56, display: "flex", alignItems: "center", padding: "0 24px", gap: 12, flexShrink: 0 }}>
        <button onClick={() => onNavigate("home")}
          style={{ fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700, color: "#ff5733", background: "none", border: "none", cursor: "pointer" }}>
          Tis<span style={{ color: "#191919" }}>tory</span>
        </button>
        <span style={{ fontSize: 14, color: "#bbb" }}>회원가입</span>
      </nav>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 60px" }}>
        <StepIndicator current={step} />

        {step === 0 && <Step0Terms agreed={agreed} setAgreed={setAgreed} onNext={next} />}
        {step === 1 && <Step1Info  form={form}    setForm={setForm}      onNext={next} onPrev={prev} />}
        {step === 2 && <Step2Blog  form={form}    setForm={setForm}      onNext={next} onPrev={prev} />}
        {step === 3 && <Step3Done  form={form}    onNavigate={onNavigate} />}

        {step < 3 && (
          <p style={{ fontSize: 13, color: "#bbb", marginTop: 20 }}>
            이미 계정이 있으신가요?{" "}
            <button onClick={() => onNavigate("login")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#ff5733", fontWeight: 600, fontSize: 13, fontFamily: "'Noto Sans KR',sans-serif" }}>
              로그인
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
