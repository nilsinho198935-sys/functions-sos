const { onRequest } = require("firebase-functions/https");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

initializeApp();

exports.assasWebhook = onRequest(async (req, res) => {
  const evento = req.body;

  if (evento.event === "PAYMENT_RECEIVED" || evento.event === "PAYMENT_CONFIRMED") {
    const pagamento = evento.payment;
    const cpf = pagamento.externalReference;
    const plano = pagamento.description;

    if (cpf && plano) {
      const db = getDatabase();
      await db.ref("profissionais").orderByChild("cpf").equalTo(cpf).once("value", async (snapshot) => {
        snapshot.forEach((child) => {
          child.ref.update({ plano: plano });
        });
      });
    }
  }

  res.status(200).send("OK");
});
