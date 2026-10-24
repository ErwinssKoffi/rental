import React from 'react';
import { TypeAnimation } from 'react-type-animation';


const Hero = () => {
    return (
        <div>
            <div className="overflow-hidden   text-center">
                <div className=" bottom-0 left-0 right-0 top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <div className="flex h-full justify-start ml-10">
                        <div className="text-white">
                            <div className="video-content space-y-2  mt-60 max-[600px]:mt-96">
                                <TypeAnimation
                                    sequence={[
                                        'LAMBORGHINI',
                                        1000
                                    ]}
                                    wrapper="p"
                                    cursor={false}
                                    repeat={1}
                                    className="text-8xl max-[600px]:text-3xl font-bold"
                                />
                                <TypeAnimation
                                    sequence={[
                                        '      RENT, DRIVE, CONQUER',
                                        3000
                                    ]}
                                    wrapper="p"
                                    cursor={false}
                                    repeat={1}
                                    speed={{ type: 'keyStrokeDelayInMs', value: 200 }}
                                    className="text-5xl max-[600px]:text-5xl font-bold flex flex-wrap"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Hero;














