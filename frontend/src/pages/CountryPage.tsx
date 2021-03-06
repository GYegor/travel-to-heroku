import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { onUtcOffsetChanged } from '../actions/utc-offset-action';
import { onCountryChanged } from '../actions/country-action';
import { useParams } from "react-router-dom";
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import '../styles/ImageGallery.scss';
import { makeStyles } from '@material-ui/core';
import { theme } from "../mui-style";
import { Loader } from "../components/Loader";
import { CountryAvatar } from "../components/CountryAvatar";
import { ICountryAvatarProps, ISightseeing, AppState, Language, ICountryFull, IRating } from "../interfaces";
import cloudName from '../constants/cloudName';
import cloudUrl from '../constants/cloudUrl';
import { onWeatherParamsChanged } from "../actions/weather-params-action";
import SightRating from "../components/SightRating";

const useStyles = makeStyles({
  container: {
    height: '100%',
    overflowY: 'auto',
  },
  wrapper: {
    positon: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(0, 2, 3, 2)
  },
});

const CountryPage: React.FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { id } = useParams<Record<string, string | undefined>>();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ReactImageGalleryItem[]>([]);  
  const [avatar, setAvatar] = useState<ICountryAvatarProps | null>(null);
  const [ratings, setRatings] = useState<IRating[] | []>([]);
  const [ imgIndex, setImgIndex ] = useState(0);


  const lang = useSelector<AppState, Language>(state => state.lang);  

  useEffect(() => {
    fetch(`/api/countries/${id}?lang=${Language[lang]}`)
      .then(response => response.json())
      .then((data: ICountryFull) => {
        const getImagesFromData = (): ReactImageGalleryItem[] => {
          return data.sights.map((elem: ISightseeing) => {
            return {
              original: `${cloudUrl}/${cloudName}/${elem.imageId}`,
              thumbnail: `${cloudUrl}/${cloudName}/image/upload/h_150/${elem.smallImageId}`,
              originalAlt: elem.name,
              description: elem.description,
            };
          });
        };

        const getAvatarFromData = (): ICountryAvatarProps => {
          return ({
            name: data.name,
            capital: data.capital,
            imageUrl: `${cloudUrl}/${cloudName}/${data.imageId}`,
            description: data.description,
          })
        }

        const getRatingsFromData = (): IRating[] => data.sights.map((elem: ISightseeing) => elem.rating);
        
        setImages(getImagesFromData());
        setAvatar(getAvatarFromData());
        setRatings(getRatingsFromData());
        dispatch(onUtcOffsetChanged(data.utcOffset))
        dispatch(onWeatherParamsChanged(data))
        dispatch(onCountryChanged(data));
        setLoading(false);                       
      })
  }, [id, lang])

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        { loading && <Loader />}
        { avatar && <CountryAvatar {...avatar} />}        
        { images.length !== 0 && <ImageGallery 
            items={images}
            thumbnailPosition={"bottom"}
            infinite={true}
            lazyLoad={true}
            showBullets={true}
            slideDuration={500}
            slideInterval={2000}
            renderCustomControls={() => <SightRating points={ratings[imgIndex] ? ratings[imgIndex].points : 0}/>}
            onSlide={(curIndex) => {setImgIndex(curIndex)}}
          />
        }
      </div>
    </div>
  );
};

export default CountryPage;