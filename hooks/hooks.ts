import dotenv from 'dotenv';
    fs.rmSync('reports/videos', {
      recursive: true,
      force: true
    });
  }

  if (fs.existsSync('reports/screenshots')) {
    fs.rmSync('reports/screenshots', {
      recursive: true,
      force: true
    });
  }

  if (!fs.existsSync('reports/screenshots')) {
    fs.mkdirSync('reports/screenshots', {
      recursive: true
    });
  }

  if (!fs.existsSync('reports/videos')) {
    fs.mkdirSync('reports/videos', {
      recursive: true
    });
  }

  browser = await chromium.launch({

    headless: process.env.CI ? true : false,

    args: [
      '--start-maximized'
    ]
  });

  page = await browser.newPage({

    viewport: {
      width: 1920,
      height: 1080
    },

    recordVideo: {

      dir: 'reports/videos',

      size: {
        width: 1920,
        height: 1080
      }
    }
  });
});

After(async function (scenario) {

  if (scenario.result?.status === Status.FAILED && page) {

    const nomeArquivo = scenario.pickle.name
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    await page.screenshot({

      path: `reports/screenshots/ERRO_${nomeArquivo}.png`,

      fullPage: true
    });

    console.log('📸 Screenshot salva!');
  }

  await page?.close();

  await browser?.close();
});
