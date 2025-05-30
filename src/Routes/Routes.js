import Auth from '~/Pages/Auth';
import Score from '~/Pages/KMAScore';
import Admin from '~/Pages/StudentManagement';
import {VerifyForm, LoginForm, RegisterForm, ResetPasswordForm}  from '~/components/Form';
import paths from '~/Config/routes';
import StudentList from '~/components/StudentList';
import AddStudent from '~/components/AddStudent';
import Subjects from '~/components/Subjects';
import AddScore from '~/components/AddScore';
import DefaultLayout from '~/Layouts/DefaultLayout';
import RedirectToLogin from '~/Config/Redirect'
import ScoreList from '~/components/ScoresList';
export const publicRoutes = [
    {
        path: paths.default,
        element: RedirectToLogin,
    },
    {
        path: paths.auth,
        element: Auth,
        children: [
            {
                path: "login",
                element: LoginForm
            },
            {
                path: "register",
                element: RegisterForm
            },
            {
                path: "verify",
                element: VerifyForm
            },
            {
                path: "reset-password",
                element: ResetPasswordForm
            }
        ]
    },
    {
        path: paths.score,
        layout: DefaultLayout,
      
        element: Score
    },
    {
        path: paths.administration,
        layout: DefaultLayout,
    
        element: Admin,
        children: [
            {
                path: '',
                element: StudentList,
            },
            {
                path: paths.studentList,
                element: StudentList,
               
            },
            {
                path: paths.addStudent,
                element: AddStudent,
                
            },
            {
                path: paths.subjects,
                element: Subjects
            },
            {
                path: paths.addScore,
                element: AddScore
            },
            {
                path: paths.scoreList,
                element: ScoreList
            }
        ]
    }
];

export const privateRoutes = [];
