mongo danalica --quiet --eval "db.createUser(
    { 
        user: 'd5h2S8m0I',
        pwd: 'hf3w2nE2',
        roles: [
            {
                role: 'readWrite', db: 'danalica'
            }
        ]
    }
)"
