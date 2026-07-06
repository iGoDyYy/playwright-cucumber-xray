export const isStaging =
  process.env.ENVIRONMENT === 'staging';

export const environment = {
  isStaging,

  loginUrl: isStaging
    ? process.env.PANEL_URL_STAGING!
    : `${process.env.BASE_URL}/painel/login`,

  baseUrl: isStaging
    ? process.env.PANEL_BASE_URL_STAGING!
    : process.env.BASE_URL!,

  email: isStaging
    ? process.env.PANEL_EMAIL_STAGING!
    : process.env.EMAIL_LOGIN!,

  password: isStaging
    ? process.env.PANEL_PASSWORD_STAGING!
    : process.env.PASSWORD_LOGIN!
};