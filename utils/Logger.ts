export class Logger {

    private static readonly line =
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    static title(title: string) {
        console.log("");
        console.log(this.line);
        console.log(`🚀 ${title}`);
        console.log(this.line);
    }

    static section(title: string) {
        console.log("");
        console.log(`📌 ${title}`);
        console.log("──────────────────────────────────────────────────");
    }

    static info(message: string) {
        console.log(`ℹ️  ${message}`);
    }

    static success(message: string) {
        console.log(`✅ ${message}`);
    }

    static warning(message: string) {
        console.log(`⚠️  ${message}`);
    }

    static error(message: string) {
        console.log(`❌ ${message}`);
    }

    static separator() {
        console.log("");
        console.log("──────────────────────────────────────────────────");
    }

}