// src/component/login/SetupPassword.jsx
import { FiLock } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import notifyApiResponse from "@utils/notifyApiResponse";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import { UserContext } from "@context/UserContext";

const SetupPassword = ({ userInfo, setModalOpen }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const { dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [notMatch, setNotMatch] = useState({ message: '' });
    const { t } = useTranslation();

    const comparePasswords = (value) => {
        if (value !== watch("newPassword")) {
            setNotMatch({ message: t('common:passwordsDoNotMatch') });
        } else {
            setNotMatch('');
        }
    };

    const onSubmit = ({ newPassword, confirmPassword }) => {
        if (newPassword !== confirmPassword) {
            setNotMatch({ message: t('common:passwordsDoNotMatch') });
            return;
        }

        setLoading(true);
        CustomerServices.changePassword({
            email: userInfo?.E_Mail,
            currentPassword: userInfo?.LicTradNum,
            newPassword
        })
            .then((res) => {
                notifyApiResponse(res, true);
                
                // Update userInfo in context and cookies
                const updatedUserInfo = {
                    ...userInfo,
                    isWithoutPassword: false
                };
                
                dispatch({ type: 'USER_LOGIN', payload: updatedUserInfo });
                Cookies.set('userInfo', JSON.stringify(updatedUserInfo));
                
                setLoading(false);
                setModalOpen(false);
                reset();
            })
            .catch((err) => {
                setLoading(false);
                notifyApiResponse(err, false);
            });
    };

    return (
        <>
            <div className="text-center mb-4">
                <ShapiraTitle text={t("common:setupPassword")} height={50} key="setupPassword" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-3">
                <p className="text-center">{t("common:newUserPasswordSetup")}</p>

                <div className="">
                    <InputArea
                        register={register}
                        name="newPassword"
                        type="password"
                        placeholder={t("common:password")}
                        Icon={FiLock}
                    />
                    <Error errorName={errors.newPassword} />
                </div>

                <div className="mb-1">
                    <InputArea
                        register={register}
                        name="confirmPassword"
                        type="password"
                        placeholder={t('common:confirmPassword')}
                        Icon={FiLock}
                        onChange={(e) => comparePasswords(e.target.value)}
                    />
                    <Error errorName={notMatch} />
                </div>

                {loading ? (
                    <button
                        disabled={loading}
                        type="submit"
                        className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                    >
                        <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                        />
                        <span className="font-serif ml-2 font-light">{t("common:processing")}</span>
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                    >
                        {t("common:savePassword")}
                    </button>
                )}
            </form>
        </>
    );
};

export default SetupPassword;