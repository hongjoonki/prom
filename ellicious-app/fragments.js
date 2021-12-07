import { gql } from "apollo-boost";

export const POST_FRAGMENT = gql`
  fragment PostParts on Post {
    id
    caption
    rating
    storeLocation
    placeId
    storeName
    details
    likes {
      id
    }
    picked {
      id
    }
    user {
      id
      avatar
      username
      isSelf
    }
    files {
      id
      url
    }
    likeCount
    isLiked
    isPicked
    pickCount
    commentCount
    childCommentCount
    comments {
      id
      text
      user {
        id
        username
        avatar
      }
    }
    createdAt
  }
`;

export const FOLLOWER_FRAGMENT = gql`
  fragment FollowerParts on User {
    followers{
      username
      avatar
      firstName
      isSelf
      id
      isFollowing
    }
  }
`

export const FOLLOWING_FRAGMENT = gql`
  fragment FollowingParts on User {
    following{
      username
      firstName
      avatar
      id
      isSelf
      isFollowing
    }
  }
`

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    avatar
    username
    email
    lastName
    firstName
    fullName
    isFollowing
    isSelf
    bio
    category{
      categoryName
      id
    }
    following{
      username
      avatar
      id
      firstName
      isFollowing
      isSelf
    }
    followers{
      username
      avatar
      firstName
      id
      isFollowing
      isSelf
    }
    followingCount
    followersCount
    categoryCount
    postsCount
    posts {
      id
      likeCount
      files{
        id
        url
      }
      pickCount
      commentCount
    }
  }`;

export const PICK_FRAGMENT = gql`
  fragment PickInfo on Pick {
    post {
      id
      storeLat
      storeLong
      rating
      placeId
      details
      storeLocation
      storeName
      files{
        url
        id
      }
      user{
        username
        avatar
        id
      }
    }
  }
`

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    categoryName
  }`

export const CATEGORYINFO_FRAGMENT = gql`
fragment CategoryInfo on Category {
    id
    categoryName
    posts{
      id
      storeName
      storeLocation
      storeLat
      storeLong
      rating
      details
      placeId
      files{
        id
        url
      }
    }
}`

export const ALARM_FRAGEMENT = gql`
  fragment AlarmParts on Alarm {
    id
    from{
      id
      username
      avatar
      isFollowing
    }
    check
    category
    post{
      id
      files{
        id
        url
      }
    }
  }
  `

export const POST_COMMENT = gql`
  fragment CommentParts on Comment {
    id
    user{
      id
      isSelf
      username
      avatar
    }
    childCount
    post{
      id
    }
    text
    
    createdAt
  }
`
export const CHILD_COMMENT = gql`
  fragment ChildCommentParts on ChildComment {
    id
    user{
      id
      isSelf
      username
      avatar
    }
    text
    createdAt
  }
`



/*

childComment{
  id
  text
  user{
    username
    avatar
  }
}*/