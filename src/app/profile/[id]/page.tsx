export default function userProfile ({params}:number) {
    return(
        <div>
            <h1>Profile</h1>
            <hr/>
            <p>Profile page <span>{params.id}</span></p>
        </div>
    )
    }