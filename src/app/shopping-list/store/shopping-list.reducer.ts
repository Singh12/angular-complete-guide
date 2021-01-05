import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list-actions';
// Creating state
export interface State {
    ingredients: Ingredient[];
    editIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apple', 1),
        new Ingredient('Tomatoes', 2)
    ],
    editIngredient: null,
    editedIngredientIndex: -1
};

// ngrx pass two parameter sate and action
export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
    // Find which kind of action is dispached
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            console.log( state.editedIngredientIndex);
            const updateIngredients = [...state.ingredients];
            updateIngredients[state.editedIngredientIndex] = action.payload;
            return {
                ...state,
                ingredients: updateIngredients
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex;
                })
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editIngredient: { ...state.ingredients[action.payload] },
                editedIngredientIndex: action.payload
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
    }
}
