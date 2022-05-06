import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as moment from "moment";

admin.initializeApp();
/**
 * Update Challenge
 * Accept the challenge.
 */
exports.updateChallenge = functions.firestore
  .document("Challenge/{challengeId}")
  .onUpdate((change) => {
    const challenge = change.after.data();
    const challengeDraft = change.before.data();
    /* INPROGRESS */
    if (challenge.status == "INPROGRESS" &&
      challengeDraft.status != "INPROGRESS") {
      /* EMAIL challenger */
      admin.firestore().collection("User")
        .where("email", "==", challenge.acceptedByUserEmail)
        .get()
        .then((userItems) => {
          userItems.docs.map((user) => {
                axios
                  .get(
                    "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2FCorreo_Playfast.html?alt=media&token=85f713c6-ab5a-419b-a3d7-84c8d1270178"
                  )
                  .then(function(response) {
                    /* GET TEMPLATE EMAIL */
                    const body = response.data.replace("[FECHA]",
       moment(challenge.dateAccepted._seconds * 1000).format("YYYY-MM-DD")
                    ).
                      replace("[MENSAJE]", challenge.contact).
                      replace("[URL]", "https://playfast-dev.web.app/challenges/challenge");
                    const message = {
                      to: challenge.createdBy,
                      message: {
                        subject: "Aceptaron tu reto",
                        html: body,
                      },
                    };
                    /* STATUS PAYMENT */
                    admin.firestore().collection("Challenge")
                    .doc(change.after.id).update({
                      "payChallenger": true,
                    });
                    /* SEND EMAIL */
                    admin.firestore().collection("Mail").add(message);
                    if (!challenge.payChallenger) {
                      /* CREATE TRANSACTION */
                      transaction({
                        userGBS: user.data().userGBS,
                        name: challenge.name,
                        amount: challenge.betAmount,
                        type: "D",
                        description: "Acepto el reto",
                        createdByUserId: challenge.createdByUserId,
                        createdBy: challenge.createdBy,
                        betAmount: challenge.betAmount,
                        id: change.after.id,
                        status: "",
                        userId: user.id,
                      });
                    }
                  });
          });
        });
    }
  });
/* UPDATE USER, UPDATE BALANCE */
exports.updateUser = functions.firestore
  .document("User/{userId}")
  .onUpdate((userChange) => {
    const user = userChange.after.data();
    if (user.inTransaction) {
      balance({
        userGBS: user.userGBS,
        id: userChange.after.id,
      });
    }
  });
/* CREATE CHALLENGE */
exports.createChallenge = functions.firestore
  .document("Challenge/{challengeId}")
  .onCreate((snap, context) => {
    const challenge = snap.data();
    /* IS REMATCH */
    if (challenge.isRematch) {
      axios
      .get(
        "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Frevanche.html?alt=media&token=e004df70-dc79-4f5c-b4d4-ca0d6c4e37cb"
      )
      .then(function(response) {
        const body = response.data.replace("[URL]",
        "https://playfast-dev.web.app/challenges/challenge/" + snap.id)
        .replace("username", challenge.createdByUsername);
        /* SEND EMAIL */
        const message = {
          to: challenge.acceptedByUserEmail,
          message: {
            subject: "¡Tenés un nuevo reto de revancha!",
            html: body,
          },
        };
        admin.firestore().collection("Mail").add(message);
      });
    }
    /* SET NEW VARIABLES */
    admin.firestore().collection("Challenge")
    .doc(snap.id).update({
      "scoreOwner": "",
      "scoreChallenger": "",
      "payChallenger": false,
      "payOwner": false,
    });
    const payment = challenge?.payOwner ? challenge.payOwner : false;
    admin.firestore().collection("User")
      .where("email", "==", challenge.createdBy)
      .get()
      .then((userItems) => {
        userItems.docs.map((user) => {
          if (!payment) {
            /* CREATE TRANSACTION */
            transaction({
              userGBS: user.data().userGBS,
              name: challenge.name,
              amount: challenge.betAmount,
              type: "D",
              description: "Creacion del reto",
              createdByUserId: challenge.createdByUserId,
              createdBy: challenge.createdBy,
              betAmount: challenge.betAmount,
              id: snap.id,
              status: "",
              userId: user.id,
            });
          }
        });
      });
  });
  /* RESET PASSWORD */
  exports.createResetPassword = functions.firestore
  .document("ResetPassword/{resetPasswordId}")
  .onCreate((snap, context) => {
    const resetPassword = snap.data();
    const actionCodeSettings = {
      url: "https://playfast-dev.web.app/auth/sign-in",
      handleCodeInApp: true,
    };
    /* CREATE LINK */
    admin.auth()
    .generatePasswordResetLink(resetPassword.email, actionCodeSettings)
    .then((link) => {
      axios
      .get(
        "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fpassword.html?alt=media&token=28e7b787-43e0-48f8-af43-23a22e5c5964"
      )
      .then(function(response) {
        const body = response.data.replace("[URL]",
        link);
        const message = {
          to: resetPassword.email,
          message: {
            subject: "Restabler contraseña",
            html: body,
          },
        };
        /* SEND EMAIL */
        admin.firestore().collection("Mail").add(message);
      });
    });
  });
  /* RESET FLAG BALANCE */
  exports.scheduledFunctionUpdatedBalance = functions.pubsub
  .schedule("every 60 minutes")
  .onRun((context) => {
    admin.firestore().collection("User")
    .get()
    .then((userItems) => {
      userItems.docs.map((user) => {
        admin.firestore().collection("User")
        .doc(user.id).update({
          "inTransaction": false,
        });
      });
    });
});
/* UPDATE BALANCE */
exports.scheduledFunctionUpdateBalance = functions.pubsub
.schedule("every 70 minutes")
  .onRun((context) => {
    admin.firestore().collection("User")
    .get()
    .then((userItems) => {
      userItems.docs.map((user) => {
        admin.firestore().collection("User")
        .doc(user.id).update({
          "inTransaction": true,
        });
      });
    });
});
/* SET NEW VARIABLES */
exports.createUser = functions.firestore
  .document("User/{userId}")
  .onCreate((snap, context) => {
    admin.firestore().collection("User")
      .doc(snap.id).update({
        "availableBalance": 0,
        "inTransaction": true,
      });
  });
exports.scheduledFunction = functions.pubsub.schedule("every 3 minutes")
  .onRun((context) => {
    /* UPDATE BALANCE */
    admin.firestore().collection("User")
    .where("inTransaction", "==", true).get()
    .then((userItems) => {
      if (userItems) {
        userItems.docs.map((user) => {
          balance({
            userGBS: user.data().userGBS,
            id: user.id,
          });
        });
      } else console.log("No such document!");
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    const today = Math.floor(Date.now() / 1000);
    /* VALIDATE IF EXPIRED */
    admin.firestore().collection("Challenge")
      .where("status", "==", "WAITING").get()
      .then((challengesItems) => {
        if (challengesItems) {
          challengesItems.docs.map((challenge) => {
            const dates = [];
            dates.push(today);
            if (challenge.data().date1 !== null) {
              dates.push(challenge.data().date1._seconds);
            }
            if (challenge.data().date2 !== null) {
              dates.push(challenge.data().date2._seconds);
            }
            if (challenge.data().date3 !== null) {
              dates.push(challenge.data().date3._seconds);
            }
            const dateSort = dates.sort(function(dateX, dateY) {
              return dateY - dateX;
            });
            if (dateSort[0] == today) {
              axios
                .get(
                  "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fexpired.html?alt=media&token=70e47e70-954d-4b25-bc80-c9d84a95d3e0"
                )
                .then(function(response) {
                  const body = response.data.replace("[NOMBRE]",
                    challenge.data().name).
                    replace("[MONTO]", challenge.data().betAmount).
                    replace("[URL]", "https://playfast-dev.web.app/challenges/challenge");
                  const message = {
                    to: challenge.data().createdBy,
                    message: {
                      subject: "Tu reto vencio",
                      html: body,
                    },
                  };
                  admin.firestore().collection("Mail").add(message);
                  admin.firestore().collection("User")
                    .where("username", "==", challenge.data().createdByUsername)
                    .get()
                    .then((userItems) => {
                      userItems.docs.map((user) => {
                        transaction({
                          userGBS: user.data().userGBS,
                          name: challenge.data().name,
                          amount: challenge.data().betAmount,
                          type: "C",
                          description: "Devolucion por vencimiento de reto",
                          createdByUserId: challenge.data().createdByUserId,
                          createdBy: challenge.data().createdBy,
                          betAmount: challenge.data().betAmount,
                          id: challenge.id,
                          status: "EXPIRED",
                          userId: user.id,
                        });
                      });
                    });
                });
            }
          });
        } else console.log("No such document!");
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
      /* VALIDATE IF CHALLENGE BEGAN */
    admin.firestore().collection("Challenge")
      .where("status", "==", "INPROGRESS").get()
      .then((challengesItems) => {
        if (challengesItems) {
          challengesItems.docs.map((challenge) => {
            const timeDone = challenge.data().dateAccepted._seconds * 1000;
            const timeNow = moment().valueOf();
            if (timeDone < timeNow) {
              admin.firestore().collection("Challenge")
              .doc(challenge.id).update({
                "status": "DONE",
              });
            }
          });
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    admin.firestore().collection("Challenge")
      .where("status", "==", "DONE").get()
      .then((challengesItems) => {
        if (challengesItems) {
          challengesItems.docs.map((challenge) => {
            /* TIME CHALLENGE ADD 150 MINUTES */
            const timeDone = moment(challenge.data()
              .dateAccepted._seconds * 1000).add(150, "minutes").valueOf();
            const timeNow = moment().valueOf();
            /* VALIDATE TIE */
            if (challenge.data().scoreChallenger == "Empate" && challenge
                      .data().scoreOwner == "Empate") {
                        /* RETURN MONEY */
                        admin.firestore().collection("User")
      .where("username", "==", challenge.data().createdByUsername)
                        .get()
                        .then((userItems) => {
                          userItems.docs.map((user) => {
                            transaction({
                              userGBS: user.data().userGBS,
                              name: challenge.data().name,
                              amount: challenge.data().betAmount,
                              type: "C",
                              description: "Devolucion por empate",
                              createdByUserId: challenge.data().createdByUserId,
                              createdBy: challenge.data().createdBy,
                              betAmount: challenge.data().betAmount,
                              id: challenge.id,
                              status: "COMPLETED",
                              userId: user.id,
                            });
                            axios
                            .get(
                              "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fresult.html?alt=media&token=d9e514ed-e611-4ab6-a67f-b86daf6e5353"
                            )
                            .then(function(response) {
                              const body = response.data.replace("[TITLE]",
                                "¡Lograste un empate!").
                                replace("[DESCRIPTION]",
      "Lograste un empate en el reto "+ challenge.data().name +
      ", pronto recibiras el monto correspondiente en tu billetera digital. ").
                                replace("[URL]", "https://playfast-dev.web.app/home");
                              const message = {
                                to: user.data().email,
                                message: {
                                  subject: "¡Lograste un empate!",
                                  html: body,
                                },
                              };
                              admin.firestore().collection("Mail").add(message);
                            });
                          });
                        });
                        admin.firestore().collection("User")
            .where("username", "==", challenge.data().acceptedByUsername)
                        .get()
                        .then((userItems) => {
                          userItems.docs.map((user) => {
                            transaction({
                              userGBS: user.data().userGBS,
                              name: challenge.data().name,
                              amount: challenge.data().betAmount,
                              type: "C",
                              description: "Devolucion por empate",
                              createdByUserId: challenge.data().createdByUserId,
                              createdBy: challenge.data().createdBy,
                              betAmount: challenge.data().betAmount,
                              id: challenge.id,
                              status: "COMPLETED",
                              userId: user.id,
                            });
                            axios
                            .get(
                              "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fresult.html?alt=media&token=d9e514ed-e611-4ab6-a67f-b86daf6e5353"
                            )
                            .then(function(response) {
                              const body = response.data.replace("[TITLE]",
                                "¡Lograste un empate!").
                                replace("[DESCRIPTION]",
  "Lograste un empate en el reto "+ challenge.data().name +
  ", pronto recibiras el monto correspondiente en tu billetera digital. ").
                                replace("[URL]", "https://playfast-dev.web.app/home");
                              const message = {
                                to: user.data().email,
                                message: {
                                  subject: "¡Lograste un empate!",
                                  html: body,
                                },
                              };
                              admin.firestore().collection("Mail").add(message);
                            });
                          });
                        });
            } else if (challenge.data().scoreChallenger == challenge.data()
              .scoreOwner && challenge.data().scoreOwner != "") {
                /* IF EXIST WINNER */
              admin.firestore().collection("User")
                .where("username", "==", challenge.data().scoreOwner)
                .get()
                .then((userItems) => {
                  userItems.docs.map((user) => {
              const amount = (challenge.data().betAmount * 2) -
              (challenge.data().platformAmount * 2);
                    transaction({
                      userGBS: user.data().userGBS,
                      name: challenge.data().name,
                      amount: amount,
                      type: "C",
                      description: "Ganador de reto",
                      createdByUserId: challenge.data().createdByUserId,
                      createdBy: challenge.data().createdBy,
                      betAmount: challenge.data().betAmount,
                      id: challenge.id,
                      status: "COMPLETED",
                      userId: user.id,
                    });
                    axios
                    .get(
                      "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fresult.html?alt=media&token=d9e514ed-e611-4ab6-a67f-b86daf6e5353"
                    )
                    .then(function(response) {
                      const body = response.data.replace("[TITLE]",
                        "¡Felicidades!").
                        replace("[DESCRIPTION]",
      "Eres el ganador del reto "+ challenge.data().name +
      ", pronto recibiras el monto del premio en tu billetera digital.").
                        replace("[URL]", "https://playfast-dev.web.app/home");
                      const message = {
                        to: user.data().email,
                        message: {
                          subject: "¡Felicidades!",
                          html: body,
                        },
                      };
                      admin.firestore().collection("Mail").add(message);
                    });
                  });
                });
            } else if (challenge.data().scoreChallenger != challenge.data()
            .scoreOwner && challenge.data().scoreChallenger != "" && challenge
                    .data().scoreOwner != "") {
                      /* VALIDATE DISPUTED */
                      const message = {
                        to: "playfastcr@gmail.com",
                        message: {
                          subject: "Reto con disputa",
     html: "<p>Hay una disputa en curso:</p><p>&nbsp;</p><ul><li>Nombre:" +
                          challenge.data().name + "</li>" +
                          "<li>Id:</li>" + challenge.id +
                          "<li><a href='" + challenge.data().ownerAttachment1 +
                          "'>Archivo del creador 1</a></li>" +
                          "<li><a href='" + challenge.data().ownerAttachment2 +
                          "'>Archivo del creador 2</a></li>" +
         "<li><a href='" + challenge.data().challengerAttachment1 +
         "'>Archivo del retador 1</a></li>" +
         "<li><a href='" + challenge.data().challengerAttachment2 +
                          "'>Archivo del retador 2</a></li>" +
                          "</ul>" +
                          "<p>Proceso:</p>" +
                          "<p>Actualizar en el collector Challenge," +
                          "buscar el id" +
                          "o nombre, actualizar el dato:&nbsp;</p>" +
                          "<p>- scoreOwner</p>" +
                          "<p>- scoreChallenger</p>" +
                          "<p>Y el status en DONE.</p>" +
                          "<p>&nbsp;</p>",
                        },
                      };
                      admin.firestore().collection("Mail").add(message);
                      admin.firestore().collection("Challenge")
                      .doc(challenge.id).update({
                        "status": "DISPUTED",
                      });
                      axios
                      .get(
                        "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fresult.html?alt=media&token=d9e514ed-e611-4ab6-a67f-b86daf6e5353"
                      )
                      .then(function(response) {
                        const body = response.data.replace("[TITLE]",
                          "Estamos verificando el marcador ").
                          replace("[DESCRIPTION]",
                "Vamos a validar la información brindada para definir"+
                " el ganador del reto. Una vez definido te notificaremos. ").
                          replace("[URL]", "https://playfast-dev.web.app/home");
                        const message = {
                          to: challenge.data().acceptedByUserEmail,
                          message: {
                            subject: "Estamos verificando el marcador ",
                            html: body,
                          },
                        };
                        admin.firestore().collection("Mail").add(message);
                      });
                      axios
                      .get(
                        "https://firebasestorage.googleapis.com/v0/b/playfast-dev.appspot.com/o/Templates%2Fresult.html?alt=media&token=d9e514ed-e611-4ab6-a67f-b86daf6e5353"
                      )
                      .then(function(response) {
                        const body = response.data.replace("[TITLE]",
                          "Estamos verificando el marcador ").
                          replace("[DESCRIPTION]",
                  "Vamos a validar la información brindada para definir"+
                  " el ganador del reto. Una vez definido te notificaremos. ").
                          replace("[URL]", "https://playfast-dev.web.app/home");
                        const message = {
                          to: challenge.data().createdBy,
                          message: {
                            subject: "Estamos verificando el marcador ",
                            html: body,
                          },
                        };
                        admin.firestore().collection("Mail").add(message);
                      });
        } else if (timeDone < timeNow) {
              if (challenge.data().scoreChallenger == "" && challenge
                .data().scoreOwner == "") {
                  /* MORE 150 MINUTES, EMPTY WINNER  */
                  admin.firestore().collection("User")
                    .where("username", "==", challenge.data().createdByUsername)
                    .get()
                    .then((userItems) => {
                      userItems.docs.map((user) => {
                        transaction({
                          userGBS: user.data().userGBS,
                          name: challenge.data().name,
                          amount: challenge.data().betAmount,
                          type: "C",
                          description: "Devolucion por vencimiento de" +
                          "actualizacion de marcador en el reto",
                          createdByUserId: challenge.data().createdByUserId,
                          createdBy: challenge.data().createdBy,
                          betAmount: challenge.data().betAmount,
                          id: challenge.id,
                          status: "CANCELED",
                          userId: user.id,
                        });
                      });
                    });
                    admin.firestore().collection("User")
      .where("username", "==", challenge.data().acceptedByUsername)
                    .get()
                    .then((userItems) => {
                      userItems.docs.map((user) => {
                        transaction({
                          userGBS: user.data().userGBS,
                          name: challenge.data().name,
                          amount: challenge.data().betAmount,
                          type: "C",
                          description: "Devolucion por vencimiento de" +
                          " actualizacion de marcador en el reto",
                          createdByUserId: challenge.data().createdByUserId,
                          createdBy: challenge.data().createdBy,
                          betAmount: challenge.data().betAmount,
                          id: challenge.id,
                          status: "CANCELED",
                          userId: user.id,
                        });
                      });
                    });
        } else if (challenge.data().scoreChallenger != "" && challenge.data()
                .scoreOwner == "") {
                  /* MORE 150 MINUTES, ONE REPORT */
                  admin.firestore().collection("User")
                  .where("username", "==", challenge.data().scoreChallenger)
                  .get()
                  .then((userItems) => {
                    userItems.docs.map((user) => {
const amount = (challenge.data().betAmount * 2) -
(challenge.data().platformAmount * 2);
                      transaction({
                        userGBS: user.data().userGBS,
                        name: challenge.data().name,
                        amount: amount,
                        type: "C",
                        description: "Ganador de reto",
                        createdByUserId: challenge.data().createdByUserId,
                        createdBy: challenge.data().createdBy,
                        betAmount: challenge.data().betAmount,
                        id: challenge.id,
                        status: "COMPLETED",
                        userId: user.id,
                      });
                    });
                  });
              } else if (challenge.data().scoreChallenger == "" &&
              challenge.data().scoreOwner != "") {
                /* MORE 150 MINUTES, ONE REPORT */
                  admin.firestore().collection("User")
                  .where("username", "==", challenge.data().scoreOwner)
                  .get()
                  .then((userItems) => {
                    userItems.docs.map((user) => {
                      const amount = (challenge.data().betAmount * 2) -
                      (challenge.data().platformAmount * 2);
                      transaction({
                        userGBS: user.data().userGBS,
                        name: challenge.data().name,
                        amount: amount,
                        type: "C",
                        description: "Ganador de reto",
                        createdByUserId: challenge.data().createdByUserId,
                        createdBy: challenge.data().createdBy,
                        betAmount: challenge.data().betAmount,
                        id: challenge.id,
                        status: "COMPLETED",
                      });
                    });
                  });
              }
            }
          });
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
  });

/**
 * Update balance
 * @param {any} data array information.
 */
function balance(data: any) {
  const config = {
    headers: {"Content-Type": "text/xml"},
  };
  const xmlBodyStr = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <GetCustomerInfo xmlns="www.extensionsoft.com/AsiInetSvcs">
        <systemID>gameFast</systemID>
        <systemPassword>cwv8{r;Dw9(9=>Xc</systemPassword>
        <clerkID>ANY</clerkID>
        <customerID>`+ data.userGBS + `</customerID>
      </GetCustomerInfo>
    </soap12:Body>
  </soap12:Envelope>`;
  axios.post("https://api.ticosports.com/betservices/SvcGetCustomerInfo.asmx", xmlBodyStr, config)
    .then(function(responseBalance) {
      const arrayBalance = responseBalance.data.split("<AvailableBalance>");
      const balance = arrayBalance[1].split("</AvailableBalance>");
      admin.firestore().collection("User")
        .doc(data.id).update({
          "availableBalance": balance[0],
          "inTransaction": false,
        });
    });
}
/**
 * Update transaction
 * @param {any} data array information.
 */
function transaction(data: any) {
  const xmlBodyStr = `<?xml version="1.0" encoding="utf-8"?>
                      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                        <soap12:Body>
                <PostTransaction xmlns="www.extensionsoft.com/AsiInetSvcs">
                            <systemID>gameFast</systemID>
                            <systemPassword>cwv8{r;Dw9(9=>Xc</systemPassword>
                            <clerkID>Admin</clerkID>
                            <customerID>`+ data.userGBS + `</customerID>
                            <amount>`+ data.amount + `</amount>
                            <tranCode>`+ data.type + `</tranCode>
                            <tranType>`+ data.type + `</tranType>
                            <description>`+ data.description + `</description>
                            <bettingAdjustmentFlagYN>N</bettingAdjustmentFlagYN>
                  <dailyFigureDate_YYYYMMDD></dailyFigureDate_YYYYMMDD>
                          </PostTransaction>
                        </soap12:Body>
                      </soap12:Envelope>`;

  const config = {
    headers: {"Content-Type": "text/xml"},
  };
      axios.post("https://api.ticosports.com/betservices/SvcPostTransaction.asmx", xmlBodyStr, config)
      .then(function(responseTransaction) {
        admin.firestore().collection("Transaction")
          .add({
            "sendXML": xmlBodyStr,
            "responseXML": responseTransaction.data,
            "challengeName": data.name,
            "createdByUserId": data.createdByUserId,
            "createdByUserGBS": data.userGBS,
            "createdByUserEmail": data.createdBy,
            "acceptedByUserId": "",
            "acceptedByUserEmail": "",
            "dateChallenge": moment().subtract(6, "hours").format("YYYY-MM-DD"),
            "amount": data.amount,
            "type": data.type,
            "detail": data.name,
            "typeTransaction": data.description,
"dateTransaction": moment().subtract(6, "hours").format("YYYY-MM-DD HH:mm:ss"),
          });
          if (data.status != "") {
            admin.firestore().collection("Challenge")
            .doc(data.id).update({
              "status": data.status,
            });
          }
        admin.firestore().collection("User")
          .doc(data.userId).update({
            "inTransaction": true,
            "inBalance": false,
          });
      });
}