const Order = require("../../Models/OrderSchema");

export default (req, res) => {
  if (req.method === "POST") {
    var mercadopago = require("mercadopago");
    mercadopago.configurations.setAccessToken(
      process.env.MERCADOPAGO_ACCESS_TOKEN
    );

    var payment_data = {
      transaction_amount: Number(req.body.transactionAmount),
      token: req.body.token,
      description: req.body.description,
      installments: Number(req.body.installments),
      payment_method_id: req.body.paymentMethodId,
      issuer_id: String(req.body.issuer),
      payer: {
        email: req.body.email,
        identification: {
          type: req.body.docType,
          number: req.body.docNumber,
        },
      },
    };

    mercadopago.payment
      .save(payment_data)
      .then(function (response) {
        res.status(200).json({
          status: response.body.status,
          status_detail: response.body.status_detail,
          id: response.body.id,
        });
      })
      .catch(function (error) {
        console.log(error);
        res.json(error);
      });
  }
};
