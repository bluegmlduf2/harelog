// 비밀번호 해시 생성 유틸리티
// 사용법: node scripts/hash-password.js "your-password"

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
    console.log('Usage: node scripts/hash-password.js "your-password"');
    process.exit(1);
}

async function hashPassword() {
    try {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);

        console.log("비밀번호:", password);
        console.log("해시:", hash);
        console.log("\n.env.local 파일에 다음과 같이 추가하세요:");
        console.log(`ADMIN_PASSWORD_HASH=${hash}`);
        console.log(
            "\n주의: ADMIN_PASSWORD_HASH를 설정하면 ADMIN_PASSWORD는 무시됩니다."
        );
    } catch (error) {
        console.error("해시 생성 중 오류:", error);
    }
}

hashPassword();
