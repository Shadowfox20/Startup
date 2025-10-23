import React from 'react';
import './profile.css';

export function Profile() {
    
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = React.useState('');

     React.useEffect(() => {
        (async () => {
            const res = await fetch('api/user/me');
            const data = await res.json();
            setUserInfo(data);
        })();
    }, []);

    function handleLogout() {
        fetch('api/auth', {
            method: 'DELETE',
        });
        navigate('/');
    }

    function showPosts(posts) {
        if (posts.length === 0) {
            return <p>No posts yet.</p>
        }
        else if (posts.length = 1) {
            const post = posts[0];
            return (
                <div className="card text-bg-secondary mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <h6 className="card-subtitle">Score: <strong>{post.score}</strong> | Completion: 
                        <strong>{post.completion}</strong> in <strong>{post.hours}</strong> hours </h6>
                        <h6 className="card-subtitle">Tags: <strong>{post.tags}</strong>
                        </h6>
                        <p>{post.review}</p>
                    </div>
                </div>
            );
        }
        else {
            const post = posts[0];
            const post1 = posts[1];
            
            return ( 
            <div className="card-pair">
                <div className="card text-bg-secondary mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <h6 className="card-subtitle">Score: <strong>{post.score}</strong> | Completion: 
                        <strong>{post.completion}</strong> in <strong>{post.hours}</strong> hours </h6>
                        <h6 className="card-subtitle">Tags: <strong>{post.tags}</strong>
                        </h6>
                        <p>{post.review}</p>
                    </div>
                </div>
                <div className="card text-bg-secondary mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{post1.title}</h5>
                        <h6 className="card-subtitle">Score: <strong>{post1.score}</strong> | Completion: 
                        <strong>{post1.completion}</strong> in <strong>{post1.hours}</strong> hours </h6>
                        <h6 className="card-subtitle">Tags: <strong>{post1.tags}</strong>
                        </h6>
                        <p>{post1.review}</p>
                    </div>
                </div>
            </div>
            );
        }
    }
    
    return (
        <main className="container-fluid bg-secondary text-center">
            <section>
                <h2>Your Profile</h2>
                <p> *Pulls information from WebSocket* </p>
            </section>
            <section>
                <h2 style={{ fontSize: "40px" }}> <img src="pfp_default.jpg" alt="Default Profile Picture" width="40" height="40" />
                    {userInfo.username} </h2>
                <p>Link Steam account <a href="#">here</a> *links to Steam API*</p>
            </section>
            <h3 style={{ marginLeft: "20px" }}> Recent Posts: </h3>
            <section>
                {showPosts(userInfo.posts)}
                {/* <div className="card-pair">
                    <div className="card text-bg-secondary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Clair Obscur: Expedition 33</h5>
                            <h6 className="card-subtitle">Score: <strong>10</strong> | Completion: <strong>Multiple
                                Playthroughs</strong> in <strong>70</strong> hours </h6>
                            <h6 className="card-subtitle">Tags: <strong>Role-Playing Game, Turn-based, Linear, Strategy</strong>
                            </h6>
                            <p>Review: The game is incredible. I enjoy turn-based combat, and have played a variety of
                                classic RPGs, and it is clear that the developers did as well. The combat flows so smoothly,
                                and their big change-up in adding a parry mechanic makes it constantly engaging and
                                rewarding. I also love that this mechanic doesn't detract from the strategic elements. For
                                most of the game, every move requires at least some thought. One thing I cannot talk enough
                                about is the story! It's one of those stories that leaves me thinking about it for months
                                after. I played through as much as I could my first time, and I still couldn't get enough,
                                so I played through it a second time just to play the story again. If you're not sure if you
                                want to play it, just try the first hour of the game, and I promise you'll be hooked!
                            </p>
                        </div>
                    </div>
                    <div className="card text-bg-secondary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Clair Obscur: Expedition 33</h5>
                            <h6 className="card-subtitle">Score: <strong>10</strong> | Completion: <strong>Multiple
                                Playthroughs</strong> in <strong>70</strong> hours </h6>
                            <h6 className="card-subtitle">Tags: <strong>Role-Playing Game, Turn-based, Linear, Strategy</strong>
                            </h6>
                            <p>Review: The game is incredible. I enjoy turn-based combat, and have played a variety of
                                classic RPGs, and it is clear that the developers did as well. The combat flows so smoothly,
                                and their big change-up in adding a parry mechanic makes it constantly engaging and
                                rewarding. I also love that this mechanic doesn't detract from the strategic elements. For
                                most of the game, every move requires at least some thought. One thing I cannot talk enough
                                about is the story! It's one of those stories that leaves me thinking about it for months
                                after. I played through as much as I could my first time, and I still couldn't get enough,
                                so I played through it a second time just to play the story again. If you're not sure if you
                                want to play it, just try the first hour of the game, and I promise you'll be hooked!
                            </p>
                        </div>
                    </div>
                </div> */}
            </section>
        </main>
    );
}