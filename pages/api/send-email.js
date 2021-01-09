const nodemailer = require("nodemailer");

export default (req, res) => {
  if (req.method === "POST") {
    const { clientData, to, monto, asunto } = req.body;
    const { apellido, nombre, direccion, provincia } = clientData;
    let envioInfo = "Entrega en local";
    if (direccion !== "" && provincia !== "") {
      envioInfo = `Entregar a: ${direccion}. ${provincia}`;
    }
    const transporter = nodemailer.createTransport({
      service: "Zoho",
      auth: {
        user: "agenciaekam@zohomail.com",
        pass: "Vod43811021",
      },
    });

    const prehtml = `
          <div class="es-wrapper-color">
      <!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
      <v:fill type="tile" color="#eeeeee"></v:fill>
    </v:background>
  <![endif]-->
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
          <tbody>
              <tr>
                  <td class="esd-email-paddings" valign="top">
                      <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                          <tbody>
                              <tr></tr>
                              <tr>
                                  <td class="esd-stripe" esd-custom-block-id="7799" align="center">
                                      <table class="es-header-body" style="background-color: #8c8d8e;" width="600" cellspacing="0" cellpadding="0" bgcolor="#8c8d8e" align="center">
                                          <tbody>
                                              <tr>
                                                  <td class="esd-structure es-p35t es-p40b es-p35r es-p35l" align="left">
                                                      <table width="100%" cellspacing="0" cellpadding="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="esd-container-frame" width="530" valign="top" align="center">
                                                                      <table width="100%" cellspacing="0" cellpadding="0">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td class="esd-block-text es-m-txt-c" align="center">
                                                                                      <h1 style="color: #ffffff; line-height: 100%; font-size: 26px;">CONFIRMACIÓN</h1>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <table class="es-content esd-footer-popover" cellspacing="0" cellpadding="0" align="center">
                          <tbody>
                              <tr>
                                  <td class="esd-stripe" align="center">
                                      <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                          <tbody>
                                              <tr>
                                                  <td class="esd-structure es-p35t es-p25b es-p35r es-p35l" esd-custom-block-id="7811" align="left">
                                                      <table width="100%" cellspacing="0" cellpadding="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="esd-container-frame" width="530" valign="top" align="center">
                                                                      <table width="100%" cellspacing="0" cellpadding="0">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td class="esd-block-text es-p20t es-p5b" align="left">
                                                                                      <h3 style="color: #333333;">Pedido Confimado!</h3>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td align="left" class="esd-block-text">
                                                                                      <p>Nombre: ${nombre}</p>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td align="left" class="esd-block-text">
                                                                                      <p>Apellido: ${apellido}</p>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td align="left" class="esd-block-text">
                                                                                      <p>Datos de entrega: ${envioInfo}</p>
                                                                                  </td>
                                                                              </tr>

                                                                              <tr>
                                                                                  <td align="center" class="esd-block-spacer es-p20" style="font-size:0">
                                                                                      <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                          <tbody>
                                                                                              <tr>
                                                                                                  <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td>
                                                                                              </tr>
                                                                                          </tbody>
                                                                                      </table>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td align="right" class="esd-block-text">
                                                                                      <p style="font-size: 20px;"><strong>Total: ${monto}</strong></p>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
</body>

          `;

    const mailOptions1 = {
      from: "agenciaekam@zohomail.com",
      to: to,
      subject: asunto,
      html: prehtml,
    };

    transporter.sendMail(mailOptions1, function (error, info) {
      if (error) {
        res.send(error);
      } else {
        res.status(200).json({ status: "Email sent", data: req.body });
      }
    });
  }
};
