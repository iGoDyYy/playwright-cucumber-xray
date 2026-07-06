import path from 'path';
import { chromium, Frame, Page } from 'playwright';
import { expect } from '@playwright/test';

const importerUrl =
  'https://detonador12345677.atlassian.net/plugins/servlet/ac/com.xpandit.plugins.xray/import-tests-page?project.key=QA&project.id=10001';

const userDataDir = path.resolve(
  'scripts/xray/chrome-profile'
);

async function clicarSeExistir(
    page: Page | Frame,
    texto: RegExp,
    timeout = 5000
  ) {
    const elemento = page.getByText(texto).first();
  
    const visivel = await elemento
      .isVisible({ timeout })
      .catch(() => false);
  
    if (visivel) {
      await elemento.click();
      return true;
    }
  
    return false;
  }

async function obterFrameXray(page: Page): Promise<Frame> {
    await page.waitForTimeout(8000);
  
    const frame = page.frames().find(item =>
      item.url().includes('us.xray.cloud.getxray.app/view/page/import-tests')
    );
  
    if (!frame) {
      throw new Error('Não foi possível localizar o iframe do Xray.');
    }
  
    return frame;
  }
  
  async function selecionarTipoCsv(page: Frame) {
    console.log('Selecionando opção CSV...');
  
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  
    const csvText = page.getByText(/^CSV$/i).first();
  
    if (await csvText.isVisible({ timeout: 5000 }).catch(() => false)) {
      await csvText.click({ force: true });
      await page.waitForTimeout(2000);
    }
  
    const inputFile = page.locator('input[type="file"]').first();
  
    if (await inputFile.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Tela File import carregada.');
      return;
    }
  
    const botaoNext = page.locator('#xray-advance-wizard');
  
    await expect(botaoNext).toBeEnabled({
      timeout: 30000
    });
  
    await botaoNext.click();
  
    console.log('Opção CSV selecionada.');
  }
  
  async function importarArquivoCsv(page: Frame) {
    console.log('Tela File import aberta.');
    console.log('No navegador, faça manualmente:');
    console.log('1. Selecione o arquivo CSV.');
    console.log('2. Altere o CSV Delimiter para ;');
    console.log('Depois disso, aguarde. O script continuará sozinho.');
  
    const botaoNext = page.locator('#xray-advance-wizard');
  
    await expect(botaoNext).toBeEnabled({
      timeout: 300000
    });
  
    await botaoNext.click();
  
    console.log('Arquivo CSV confirmado.');
  }
  
  async function configurarProjeto(page: Frame) {
    console.log('Configurando projeto QA...');
  
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  
    const checkboxCsv = page
      .getByLabel(/defined in the csv for every test/i)
      .first();
  
    if (
      await checkboxCsv.isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {
      const checked = await checkboxCsv.isChecked();
  
      if (checked) {
        await checkboxCsv.evaluate((element) => {
          (element as HTMLInputElement).click();
        });
      }
    }
  
    const camposTexto = page.locator('input[type="text"]');
  
    const campoProjeto = camposTexto.first();
  
    await expect(campoProjeto).toBeVisible({
      timeout: 30000
    });
  
    await campoProjeto.fill('QA');
  
    await page.waitForTimeout(1500);
  
    await campoProjeto.press('ArrowDown');
    await campoProjeto.press('Enter');
  
    await page.waitForTimeout(1500);
  
    const botaoNext = page.locator('#xray-advance-wizard');
  
    await expect(botaoNext).toBeEnabled({
      timeout: 30000
    });
  
    await botaoNext.click();
  
    console.log('Projeto QA configurado.');
  }

  function escapeRegex(texto: string) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  async function selecionarCampoPorIndice(
    page: Frame,
    indice: number,
    valor: string
  ) {
    const campo = page
      .locator('div[class*="-singleValue"]')
      .nth(indice);
  
    await expect(campo).toBeVisible({
      timeout: 30000
    });
  
    await campo.click();
  
    const opcao = page
      .getByText(new RegExp(`^${escapeRegex(valor)}$`))
      .last();
  
    await expect(opcao).toBeVisible({
      timeout: 30000
    });
  
    await opcao.click();
  
    await page.waitForTimeout(700);
  }
  
  async function mapearCamposEImportar(page: Frame) {
    console.log('Aguardando tela de mapeamento...');
  
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  
    console.log('Mapeando campos...');
  
    await selecionarCampoPorIndice(page, 0, 'Issue ID');
    await selecionarCampoPorIndice(page, 1, 'Resumo');
    await selecionarCampoPorIndice(page, 2, 'Descrição');
    await selecionarCampoPorIndice(page, 3, 'Priority Name');
    await selecionarCampoPorIndice(page, 4, 'Test Type');
    await selecionarCampoPorIndice(page, 5, 'Action*');
    await selecionarCampoPorIndice(page, 6, 'Data');
    await selecionarCampoPorIndice(page, 7, 'Expected Result');
  
    console.log('Campos mapeados.');
  
    const beginImport = page
      .getByRole('button', { name: /begin import/i })
      .first();
  
    await expect(beginImport).toBeVisible({
      timeout: 30000
    });
  
    await beginImport.click();

console.log('Importação iniciada. Aguardando resultado...');

await expect(
    page.getByText(/Issue\(s\) imported successfully/i).first()
  ).toBeVisible({
    timeout: 120000
  });

console.log('Importação finalizada com sucesso.');

  }
  
  (async () => {
    const context = await chromium.launchPersistentContext(
      userDataDir,
      {
        headless: false,
        viewport: {
          width: 1920,
          height: 1080
        }
      }
    );
  
    const page = await context.newPage();
  
    try {
      console.log('Abrindo Test Case Importer...');
  
      await page.goto(importerUrl);

      await page.waitForTimeout(5000);
      
      const frames = page.frames();
      
      console.log('FRAMES ENCONTRADOS:');
      
      for (const frame of frames) {
        console.log(frame.url());
      }
  
      const xrayFrame = await obterFrameXray(page);

    await selecionarTipoCsv(xrayFrame);

    await importarArquivoCsv(xrayFrame);

    await configurarProjeto(xrayFrame);

    await mapearCamposEImportar(xrayFrame);
  
      console.log(
        'IMPORTAÇÃO CSV PARA XRAY FINALIZADA COM SUCESSO'
      );
    } catch (error) {
      console.error(
        'ERRO DURANTE A IMPORTAÇÃO:',
        error
      );
    }
  
    console.log('Importação finalizada com sucesso.');
    console.log('Aguardando 30 segundos antes de fechar...');
    
    await page.waitForTimeout(60000);
    
    await context.close();
  })();