import { Carousel } from 'flowbite-react';
import styled from 'styled-components';

const sliderTextBkgUrl = 'public/assets/images/cover/slider-text-bkg.png';

type T_ImageContainer = {
  imageUrl: string;
};

type T_SliderTextContainer = {
  sliderTextBkgUrl: string;
};

const ImageContainer = styled.div<T_ImageContainer>`
  width: 100%;
  background-image: url(${(p) => p.imageUrl});

  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  justify-content: flex-end;

  flex-direction: row;
  /* filter: grayscale(30%); */
  filter: blur(0.34px);

  background-color: #101512cc !important;
`;

const SliderTextContainer = styled.div<T_SliderTextContainer>`
  width: 52%;
  height: 100%;
  border-radius: 2%;
  display: flex;

  background-size: cover;
  background-repeat: no-repeat;
  background-color: #101512cc !important;

  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
`;

const SliderTitle = styled.p`
  text-align: center;
  right: 0;
  top: 0;
  margin: 5px;
  width: 50%;
  height: 100px;
  position: absolute;
  font-size: 48px;
  color: white;
  font-weight: 700;
`;

const SliderText = styled.p`
  text-align: center;
  right: 0;
  top: 60%;
  margin: 5px;
  width: 50%;
  height: 100px;
  position: absolute;
  font-size: 24px;
  color: white;
  font-weight: 700;
`;

const SliderCarousel = styled(Carousel)`
  height: 400px;
`;

export const HomePageSlider = () => {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <SliderCarousel pauseOnHover>
        <ImageContainer
          imageUrl="https://img.freepik.com/free-photo/group-international-students-sitting-grass-together-park-university-african-caucasian-girls-indian-boy-talking-outdoors_1157-50065.jpg?t=st=1708684780~exp=1708688380~hmac=3bd13570c8efd61351953e248e06c6faf95d896f2eb3cdae3b487bea01804017&w=1800"
          className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white"
        >
          <SliderTextContainer sliderTextBkgUrl={sliderTextBkgUrl}></SliderTextContainer>
          <SliderTitle>Welcome to Sparked - your gateway to knowledge!</SliderTitle>

          <SliderText>
            {`
            Explore a world of learning with our extensive collection of books,
            magazines, and resources. Let's ignite your curiosity and spark your
            imagination
            `}
          </SliderText>
        </ImageContainer>

        <ImageContainer
          imageUrl="https://img.freepik.com/free-photo/side-view-woman-working-as-travel-agent_23-2150433458.jpg?t=st=1708702733~exp=1708706333~hmac=e4a1690efa66d45683bf2f58364e65128efa548abe3bafac774427f0993b1635&w=1800"
          className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white"
        >
          <SliderTextContainer sliderTextBkgUrl={sliderTextBkgUrl}></SliderTextContainer>
          <SliderTitle>
            {`
             Presenting Educational And Training Content With Passion And AI.  

            `}
          </SliderTitle>

          <SliderText>
            {`
               Discover a revolutionary approach to educational and training
            content delivery. At the intersection of passion and artificial
            intelligence (AI), our platform redefines the learning experience
            `}
          </SliderText>
        </ImageContainer>

        <ImageContainer
          className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white"
          imageUrl="https://img.freepik.com/free-photo/cheerful-man-classroom-posing-camera_23-2147663989.jpg?t=st=1708685035~exp=1708688635~hmac=8eb9796885031de81ed4c50e28467fed995bf0440ec6fdf08b49e566d727ee7d&w=1800"
        >
          <SliderTextContainer sliderTextBkgUrl={sliderTextBkgUrl}></SliderTextContainer>
          <SliderTitle>
            {`
                Discover what's new at Sparked! Explore our latest arrivals
            `}
          </SliderTitle>

          <SliderText>
            {`
               from captivating novels to informative guides. Stay ahead of the
            curve and dive into fresh reads to fuel your curiosity."
            `}
          </SliderText>
        </ImageContainer>

        <ImageContainer
          imageUrl="https://img.freepik.com/free-photo/group-four-african-american-girls-walking-stairs-city_627829-2812.jpg?t=st=1708684880~exp=1708688480~hmac=2c669e521f8474c34d8bf28f4a3459309a157203b6e8093eb5c6bb8e9dd1b4d4&w=1800"
          className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white"
        >
          <SliderTextContainer sliderTextBkgUrl={sliderTextBkgUrl}></SliderTextContainer>
          <SliderTitle>
            {`
               Check out Sparked's featured books! Immerse yourself in captivating
            stories
            `}
          </SliderTitle>

          <SliderText>
            {`
              insightful non-fiction, and educational resources handpicked by our
            team. Find your next favorite read and let your imagination soar!"
            `}
          </SliderText>
        </ImageContainer>

        <ImageContainer
          imageUrl="https://img.freepik.com/free-photo/teacher-helping-kids-class_23-2148892533.jpg?t=st=1708702783~exp=1708706383~hmac=77580a907ee62f0b379966e992eb285eb10eea0b382d87f72b78b0ef7c8cdfd6&w=1800"
          className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white"
        >
          <SliderTextContainer sliderTextBkgUrl={sliderTextBkgUrl}></SliderTextContainer>
          <SliderTitle>
            {`
             Join us for exciting events at Sparked! Be on the lookout for
            upcoming author visits  

            `}
          </SliderTitle>

          <SliderText>
            {`
             Don't miss out on book clubs, reading challenges, and more. Get
            involved in our vibrant community and let's spark your love for
            reading together!"  

            `}
          </SliderText>
        </ImageContainer>
      </SliderCarousel>
    </div>
  );
};
