import { Logger } from "../../utils/Logger";
import { execSync } from "child_process";

async function main() {

    Logger.title("PIPELINE RESPONSÁVEL FISCAL");

    try {

        Logger.section("Executando testes");

        execSync(
            "npm run test:responsavel-fiscal",
            {
                stdio: "inherit"
            }
        );

        Logger.success("Todos os testes foram executados.");

    } catch {

        Logger.warning(
            "Os testes finalizaram com falha. O resultado será publicado no Xray mesmo assim."
        );

    }

    Logger.section("Publicando resultados no Xray");

    execSync(
        "npx ts-node scripts/xray/publishCucumberReportToXray.ts",
        {
            stdio: "inherit"
        }
    );

    Logger.success("Resultados publicados com sucesso.");

    Logger.separator();

}

main();