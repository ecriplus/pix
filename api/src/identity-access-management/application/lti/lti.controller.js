import { usecases } from '../../domain/usecases/index.js';

async function listPublicKeys(request, h, dependencies = { listLtiPublicKeys: usecases.listLtiPublicKeys }) {
  const publicKeys = await dependencies.listLtiPublicKeys();
  return h.response(publicKeys).code(200);
}

const registerSuccessTemplate = () => `<!DOCTYPE html>
<html>
  <body>
    Registration successfull, please wait...
    <script type="text/javascript">
      (window.opener ?? window.parent).postMessage({ subject:'org.imsglobal.lti.close' }, '*');
    </script>
  </body>
</html>
`;

const registerErrorTemplate = (err) => `<!DOCTYPE html>
<html>
  <body>
    <h1>Registration error</h1>
    <p>${err.message ?? err}</p>
  </body>
</html>
`;

async function register(request, h, dependencies = { registerLtiPlatform: usecases.registerLtiPlatform }) {
  const { openid_configuration: platformConfigurationUrl, registration_token: registrationToken } = request.query;

  try {
    await dependencies.registerLtiPlatform({ platformConfigurationUrl, registrationToken });
  } catch (err) {
    return h.response(registerErrorTemplate(err)).header('Content-Type', 'text/html; charset=utf-8').code(400);
  }

  return h.response(registerSuccessTemplate()).header('Content-Type', 'text/html; charset=utf-8');
}

export const ltiController = { listPublicKeys, register };
