
export const loginForm = [
  {
    id: 'username',
    title: 'Username',
    helperText: 'Enter your username',
    component: 'text',
    validate: {
      type: 'string',
      methods: [
        [
          'required',
          'Username is required',
        ],
        [
          'matches',
          '^\\S+$',
          'Cannot contain spaces',
        ],
        [
          'min',
          3,
          'Must be at least 3 characters',
        ],
      ],
    },
  },
  {
    id: 'password',
    title: 'Password',
    helperText: 'Enter your password',
    component: 'text',
    inputProps: {
      type: 'password',
    },
    validate: {
      type: 'string',
      methods: [
        [
          'required',
          'Password is required',
        ],
        [
          'matches',
          '^\\S+$',
          'Cannot contain spaces',
        ],
        [
          'min',
          6,
          'Must be at least 6 characters',
        ],
      ],
    },
  },
]

export const initialUserForm = [
  {
    id: 'username',
    title: 'Username',
    helperText: 'Enter your username',
    component: 'text',
    validate: {
      type: 'string',
      methods: [
        [
          'required',
          'Username is required',
        ],
        [
          'matches',
          '^\\S+$',
          'Cannot contain spaces',
        ],
        [
          'min',
          3,
          'Must be at least 3 characters',
        ],
      ],
    },
  },
  {
    id: 'permission',
    title: 'Access Level',
    helperText: 'Choose the access level for this user',
    component: 'select',
    options: [
      {
        title: 'Superuser',
        value: 'superuser',
      },
      {
        title: 'Admin',
        value: 'admin',
      },
      {
        title: 'User',
        value: 'user',
      },
    ],
    validate: {
      type: 'string',
      methods: [
        [
          'required',
          'Access Level is required',
        ],
      ],
    },
    extraProps: {
      disabled: true,
    },
  },
  {
    id: 'password',
    title: 'Password',
    helperText: 'Enter your password',
    component: 'text',
    inputProps: {
      type: 'password',
    },
    validate: {
      type: 'string',
      methods: [
        [
          'required',
          'Password is required',
        ],
        [
          'matches',
          '^\\S+$',
          'Cannot contain spaces',
        ],
        [
          'min',
          6,
          'Must be at least 6 characters',
        ],
      ],
    },
  },
  {
    id: 'confirmPassword',
    title: 'Confirm Password',
    helperText: 'Confirm your password',
    component: 'text',
    inputProps: {
      type: 'password',
    },
    validate: {
      type: 'string',
      methods: [
        [
          'required',
          'Confirm Password is required',
        ],
        [
          'matches',
          '^\\S+$',
          'Cannot contain spaces',
        ],
        [
          'min',
          6,
          'Must be at least 6 characters',
        ],
        [
          'sameAs',
          'password',
          'Must be equal to password',
        ],
      ],
    },
  },
]
