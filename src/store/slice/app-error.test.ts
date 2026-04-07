import { clearErrorAction } from '../api-actions';
import { appError, setError } from './app-error';

describe('AppError Slice', () => {
  const initialState: { error: string | null } = {
    error: null,
  };

  describe('Reducers', () => {
    it('should return initial state with empty action', () => {
      const emptyAction = { type: '' };
      const result = appError.reducer(undefined, emptyAction);

      expect(result).toEqual(initialState);
    });

    it('should return default initial state with empty action', () => {
      const emptyAction = { type: '' };
      const expectedState = {
        error: 'Some error message',
      };

      const result = appError.reducer(expectedState, emptyAction);

      expect(result).toEqual(expectedState);
    });

    describe('setError', () => {
      it('should set error message when action payload is string', () => {
        const errorMessage = 'Failed to load offers';
        const action = setError(errorMessage);
        const result = appError.reducer(initialState, action);

        expect(result.error).toBe(errorMessage);
        expect(result.error).toEqual(errorMessage);
      });

      it('should set error to null when action payload is null', () => {
        const stateWithError = {
          error: 'Some error',
        };
        const action = setError(null);
        const result = appError.reducer(stateWithError, action);

        expect(result.error).toBeNull();
        expect(result.error).toEqual(null);
      });

      it('should update existing error message', () => {
        const stateWithError = {
          error: 'First error message',
        };
        const newErrorMessage = 'Second error message';
        const action = setError(newErrorMessage);
        const result = appError.reducer(stateWithError, action);

        expect(result.error).toBe(newErrorMessage);
        expect(result.error).not.toBe('First error message');
      });

      it('should handle empty string as error message', () => {
        const action = setError('');
        const result = appError.reducer(initialState, action);

        expect(result.error).toBe('');
      });
    });
  });

  describe('ExtraReducers', () => {
    describe('clearErrorAction', () => {
      it('should set error to null when clearErrorAction is fulfilled', () => {
        const stateWithError = {
          error: 'Some network error',
        };
        const action = clearErrorAction.fulfilled(undefined, '', undefined);
        const result = appError.reducer(stateWithError, action);

        expect(result.error).toBeNull();
        expect(result.error).toEqual(null);
      });

      it('should keep error as null when clearing null error', () => {
        const action = clearErrorAction.fulfilled(undefined, '', undefined);
        const result = appError.reducer(initialState, action);

        expect(result.error).toBeNull();
      });

      it('should not modify state on pending or rejected', () => {
        const stateWithError = {
          error: 'Persistent error',
        };

        const pendingAction = clearErrorAction.pending('', undefined);
        const pendingResult = appError.reducer(stateWithError, pendingAction);
        expect(pendingResult.error).toBe('Persistent error');

        const rejectedAction = clearErrorAction.rejected(null, '', undefined);
        const rejectedResult = appError.reducer(stateWithError, rejectedAction);
        expect(rejectedResult.error).toBe('Persistent error');
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle setError followed by clearErrorAction', () => {
      let state = initialState;

      const setErrorAction = setError('Network failure');
      state = appError.reducer(state, setErrorAction);
      expect(state.error).toBe('Network failure');

      const clearAction = clearErrorAction.fulfilled(undefined, '', undefined);
      state = appError.reducer(state, clearAction);
      expect(state.error).toBeNull();
    });

    it('should handle multiple error updates in sequence', () => {
      let state = initialState;

      const errors = [
        'Error 1',
        'Error 2',
        'Error 3',
        null,
        'Error 4',
      ];

      errors.forEach((error) => {
        const action = setError(error);
        state = appError.reducer(state, action);
        expect(state.error).toBe(error);
      });
    });
  });
});
