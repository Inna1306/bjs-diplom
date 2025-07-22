const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        } else {
            console.error("Выход не удался", response.error);
        }
    });
};

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

function getRates() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
};
getRates();
setInterval(getRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс пополнен");
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка пополнения баланса");
        }
    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Валюта конвертирована");
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка при конвертации");
        }
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response, data);
            moneyManager.setMessage(true, "Деньги переведены");
        } else {
            moneyManager.setMessage(false, response.error || "Ошибка при переводе средств");
        }
    });
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            ApiConnector.getFavorites((response) => {
                if (response.success) {
                    favoritesWidget.clearTable();
                    favoritesWidget.fillTable(response.data);
                    moneyManager.updateUsersList(response.data);
                } else {
                    console.error("Ошибка при обновлении списка избранного");
                }
            });
            favoritesWidget.setMessage(true, "Пользователь успешно добавлен в избранное");
        } else {
            favoritesWidget.setMessage(false, response.error || "Ошибка при добавлении пользователя в избранное");
        }
    });
};

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            ApiConnector.getFavorites((response) => {
                if (response.success) {
                    favoritesWidget.clearTable();
                    favoritesWidget.fillTable(response.data);
                    moneyManager.updateUsersList(response.data);
                } else {
                    console.error("Ошибка при обновлении списка избранного");
                }
            });
            favoritesWidget.setMessage(true, "Пользователь успешно удален из избранного");
        } else {
            favoritesWidget.setMessage(false, response.error || "Ошибка при удалении пользователя из избранного");
        }
    });
};
