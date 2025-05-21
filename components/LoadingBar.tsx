import './Loader.css';

export function LoadingBar({ isLoading }:{isLoading:boolean}) {
    return (
        <div
            className={`myClass ${isLoading ? 'loading75' : 'loading100'}`}
        />
    );
}