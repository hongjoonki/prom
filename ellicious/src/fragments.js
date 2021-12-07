export const USER_FRAGMENT = `
    id
    username
    avatar
    firstName
    lastName
    `;

export const COMMENT_FRAGMENT = `
    id
    text
    headComment{
        id
        text
        user{
            ${USER_FRAGMENT}
        }
    }
    
    user{
        ${USER_FRAGMENT}
    }`;

export const PICKS_FRAGMENT = `
    id
    user{
        ${USER_FRAGMENT}
    }`

export const LIKES_FRAGMENT = `
    id
    user{
        ${USER_FRAGMENT}
    }`;

export const FILE_FRAGMENT = `
    url
`;

export const ALARM_FRAGMENT = `
    id
    to
    category
    from{
        id
        username
        avatar
    }
    post{
        id
        files{
            id
            url
        }
    }
`

export const ROOM_FRAGMENT = `
    fragment Roomparts on Room{
        id
        participants {
            ${USER_FRAGMENT}
        }
        messages
        createdAt
        updatedAt
        
    }`;
