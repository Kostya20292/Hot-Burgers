import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import MenuAdmin from './MenuAdmin';
import Burger from './Burger';
import sampleBurgers from '../sample-burgers';
import base from '../base';
import firebase from 'firebase/app';
import SignIn from './Auth/SignIn';

class App extends React.Component {
    static propTypes = {
        match: PropTypes.object,
    };

    state = {
        burgers: {},
        order: {},
    };

    componentDidMount() {
        const { params } = this.props.match;

        const localStorageRef = localStorage.getItem(params.restaurantId);
        if (localStorageRef) {
            this.setState({ order: JSON.parse(localStorageRef) });
        }

        this.ref = base.syncState(`${params.restaurantId}/burgers`, {
            context: this,
            state: 'burgers',
        });
    }

    componentDidUpdate() {
        const { params } = this.props.match;
        localStorage.setItem(
            params.restaurantId,
            JSON.stringify(this.state.order)
        );
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    addBurger = (burger) => {
        // 1. Делаем копию обьекта state
        const burgers = { ...this.state.burgers };
        // 2. Добавить новый бургер в переменную burgers
        burgers[`burger${Date.now()}`] = burger;
        // 3. Записать наш новый объект burgers в state
        this.setState({ burgers });
    };

    updateBurger = (key, updatedBurger) => {
        // 1. Делаем копию обьекта state
        const burgers = { ...this.state.burgers };
        // 2. Обновляем нужный burger
        burgers[key] = updatedBurger;
        // 3. Записать наш новый объект burgers в state
        this.setState({ burgers });
    };

    deleteBurger = (key) => {
        // 1. Делаем копию обьекта state
        const burgers = { ...this.state.burgers };
        // 2. Удаляем бургер
        burgers[key] = null;
        // 3. Записать наш новый объект burgers в state
        this.setState({ burgers });
    };

    loadSampleBurgers = () => {
        this.setState({ burgers: sampleBurgers });
    };

    addToOrder = (key) => {
        // 1. Делаем копию обьекта state
        const order = { ...this.state.order };
        // 2.  Добавить ключ к заказу со значением 1, либо обновить текущее значение
        order[key] = order[key] + 1 || 1;
        // 3. Записать наш новый объект order в state
        this.setState({ order });
    };

    deleteFromOrder = (key) => {
        // 1. Делаем копию обьекта state
        const order = { ...this.state.order };
        // 2.  Удаляем burger
        delete order[key];
        // 3. Записать наш новый объект order в state
        this.setState({ order });
    };

    handleLogout = async () => {
        await firebase.auth().signOut();
        window.location.reload();
    };

    render() {
        return (
            <SignIn>
                <div className="burger-paradise">
                    <div className="menu">
                        <Header title="Very Hot Burger" />
                        <ul className="burgers">
                            {Object.keys(this.state.burgers).map((key) => {
                                return (
                                    <Burger
                                        key={key}
                                        index={key}
                                        details={this.state.burgers[key]}
                                        addToOrder={this.addToOrder}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                    <Order
                        deleteFromOrder={this.deleteFromOrder}
                        burgers={this.state.burgers}
                        order={this.state.order}
                    />
                    <MenuAdmin
                        addBurger={this.addBurger}
                        loadSampleBurgers={this.loadSampleBurgers}
                        burgers={this.state.burgers}
                        updateBurger={this.updateBurger}
                        deleteBurger={this.deleteBurger}
                        handleLogout={this.handleLogout}
                    />
                </div>
            </SignIn>
        );
    }
}

export default App;
